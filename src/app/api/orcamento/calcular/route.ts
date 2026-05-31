import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calcularOrcamentoMulti } from "@/lib/orcamento/calculo";
import { isUfValida } from "@/lib/orcamento/salarios";

// Iter #4 — API aceita múltiplos itens. Cada item carrega sua própria atividade,
// quantidade e padrão de acabamento. O formato single-item antigo foi descontinuado
// nesta rota; quem mandar payload sem `itens` recebe erro Zod claro.

const itemSchema = z.object({
  atividadeId: z.string().min(1, "Selecione uma atividade."),
  quantidade: z
    .number({ message: "Informe uma quantidade numérica." })
    .positive("A quantidade deve ser maior que zero.")
    .max(1_000_000, "Quantidade muito alta — confira o valor."),
  padraoAcabamento: z.enum(["economico", "medio", "alto"]),
  // Campos opcionais — quando o item veio de uma sugestão de combo. Usado pra analytics.
  origem: z.enum(["manual", "sugerido"]).optional().default("manual"),
  comboTriggerId: z.string().optional(),
});

const inputSchema = z.object({
  itens: z
    .array(itemSchema)
    .min(1, "Adicione pelo menos 1 serviço ao orçamento.")
    .max(20, "Máximo de 20 serviços por orçamento."),
  uf: z
    .string()
    .length(2, "UF inválida.")
    .transform((v) => v.toUpperCase())
    .refine(isUfValida, "Estado (UF) não reconhecido."),
  cidade: z.string().trim().max(80).optional().or(z.literal("")),
  bdiPercentual: z
    .number({ message: "BDI inválido." })
    .min(0, "BDI não pode ser negativo.")
    .max(50, "BDI máximo aceito é 50%."),
  nome: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { erro: "Requisição inválida (JSON malformado)." },
      { status: 400 },
    );
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        erro: firstIssue?.message ?? "Dados inválidos.",
        campo: firstIssue?.path.join("."),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  let resultado;
  try {
    resultado = calcularOrcamentoMulti({
      itens: data.itens.map((i) => ({
        atividadeId: i.atividadeId,
        quantidade: i.quantidade,
        padraoAcabamento: i.padraoAcabamento,
      })),
      uf: data.uf,
      bdiPercentual: data.bdiPercentual,
    });
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "Erro ao calcular orçamento." },
      { status: 400 },
    );
  }

  // Ponte de compatibilidade pra Sessão 1: quando o orçamento tem APENAS 1 item,
  // populamos os campos legados (atividadeId/atividadeNome/unidade/quantidade/
  // padraoAcabamento/custoPorUnidade) do OrcamentoLead com os dados desse item.
  // Isso preserva a tela `/orcamento/resultado/[leadId]` da Iter #3 funcionando
  // enquanto a Sessão 2 não reformula a UI pra ler de `itens[]`. Em orçamentos
  // com mais de 1 item, esses campos ficam null e a tela nova trata o caso.
  const itemUnico = resultado.itens.length === 1 ? resultado.itens[0] : null;
  const custoPorUnidadeLegado = itemUnico
    ? resultado.custoFinal / itemUnico.quantidade
    : 0;

  // Cria lead + itens atomicamente.
  const lead = await prisma.$transaction(async (tx) => {
    const leadCriado = await tx.orcamentoLead.create({
      data: {
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp || null,
        uf: data.uf,
        cidade: data.cidade || null,
        bdiPercentual: data.bdiPercentual,
        // Campos legados (preenchidos só em single-item — ver comentário acima).
        atividadeId: itemUnico?.atividadeId ?? null,
        atividadeNome: itemUnico?.atividadeNome ?? null,
        unidade: itemUnico?.unidade ?? null,
        quantidade: itemUnico?.quantidade ?? null,
        padraoAcabamento: itemUnico?.padraoAcabamento ?? null,
        custoPorUnidade: custoPorUnidadeLegado,
        // Totais agregados (válidos em single ou multi).
        custoMaterialTotal: resultado.custoMaterialTotal,
        custoMaoObra: resultado.custoMaoObra,
        custoDireto: resultado.custoDireto,
        custoFinal: resultado.custoFinal,
        hhTotal: resultado.hhTotal,
        prazoDias: resultado.prazoDias,
        equipeSugerida: resultado.equipeSugerida,
        insumosCalculadosJson: JSON.stringify(resultado.insumosConsolidados),
      },
    });

    await tx.orcamentoItem.createMany({
      data: resultado.itens.map((item, idx) => {
        const inputItem = data.itens[idx];
        return {
          leadId: leadCriado.id,
          atividadeId: item.atividadeId,
          atividadeNome: item.atividadeNome,
          unidade: item.unidade,
          categoriaProfissional: item.categoriaProfissional,
          quantidade: item.quantidade,
          padraoAcabamento: item.padraoAcabamento,
          custoMaterialTotal: item.custoMaterialTotal,
          custoMaoObra: item.custoMaoObra,
          custoDireto: item.custoDireto,
          hhTotal: item.hhTotal,
          prazoDias: item.prazoDias,
          insumosCalculadosJson: JSON.stringify(item.insumosCalculados),
          origem: inputItem.origem,
          comboTriggerId: inputItem.comboTriggerId ?? null,
        };
      }),
    });

    return leadCriado;
  });

  return NextResponse.json({
    leadId: lead.id,
    custoFinal: resultado.custoFinal,
    qtdeItens: resultado.itens.length,
    redirectTo: `/orcamento/resultado/${lead.id}`,
  });
}
