import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calcularOrcamento } from "@/lib/orcamento/calculo";
import { isUfValida } from "@/lib/orcamento/salarios";

const inputSchema = z.object({
  atividadeId: z.string().min(1, "Selecione uma atividade."),
  quantidade: z
    .number({ message: "Informe uma quantidade numérica." })
    .positive("A quantidade deve ser maior que zero.")
    .max(1_000_000, "Quantidade muito alta — confira o valor."),
  uf: z
    .string()
    .length(2, "UF inválida.")
    .transform((v) => v.toUpperCase())
    .refine(isUfValida, "Estado (UF) não reconhecido."),
  cidade: z.string().trim().max(80).optional().or(z.literal("")),
  padraoAcabamento: z.enum(["economico", "medio", "alto"]),
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
      { status: 400 }
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
      { status: 400 }
    );
  }

  const data = parsed.data;

  let resultado;
  try {
    resultado = calcularOrcamento({
      atividadeId: data.atividadeId,
      quantidade: data.quantidade,
      uf: data.uf,
      padraoAcabamento: data.padraoAcabamento,
      bdiPercentual: data.bdiPercentual,
    });
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "Erro ao calcular orçamento." },
      { status: 400 }
    );
  }

  const lead = await prisma.orcamentoLead.create({
    data: {
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp || null,
      uf: data.uf,
      cidade: data.cidade || null,
      atividadeId: resultado.atividade.id,
      atividadeNome: resultado.atividade.nome,
      unidade: resultado.atividade.unidade,
      quantidade: data.quantidade,
      padraoAcabamento: data.padraoAcabamento,
      bdiPercentual: data.bdiPercentual,
      custoMaterialTotal: resultado.custoMaterialTotal,
      custoMaoObra: resultado.custoMaoObra,
      custoDireto: resultado.custoDireto,
      custoFinal: resultado.custoFinal,
      custoPorUnidade: resultado.custoPorUnidade,
      hhTotal: resultado.hhTotal,
      prazoDias: resultado.prazoDias,
      equipeSugerida: resultado.equipeSugerida,
      insumosCalculadosJson: JSON.stringify(resultado.insumosCalculados),
    },
  });

  return NextResponse.json({
    leadId: lead.id,
    atividadeNome: resultado.atividade.nome,
    unidade: resultado.atividade.unidade,
    custoFinal: resultado.custoFinal,
    custoPorUnidade: resultado.custoPorUnidade,
    redirectTo: `/orcamento/resultado/${lead.id}`,
  });
}
