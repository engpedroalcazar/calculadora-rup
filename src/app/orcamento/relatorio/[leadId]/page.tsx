import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  formatarBRL,
  formatarQuantidade,
  type InsumoCalculado,
} from "@/lib/orcamento/calculo";
import { buscarAtividade } from "@/data/orcamento/atividades-custo";
import { PrintButton } from "@/components/orcamento/PrintButton";

type Props = {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<{ token?: string }>;
};

type ItemView = {
  atividadeNome: string;
  unidade: string;
  quantidade: number;
  padraoAcabamento: string;
  categoriaProfissional: string;
  custoMaterialTotal: number;
  custoMaoObra: number;
  custoDireto: number;
  hhTotal: number;
  prazoDias: number;
  insumos: InsumoCalculado[];
};

function parseInsumos(json: string | null): InsumoCalculado[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as InsumoCalculado[];
  } catch {
    return [];
  }
}

function rotuloPadrao(p: string): string {
  if (p === "economico") return "Econômico";
  if (p === "alto") return "Alto";
  return "Médio";
}

export default async function RelatorioOrcamentoPage({ params, searchParams }: Props) {
  const { leadId } = await params;
  const { token } = await searchParams;

  const lead = await prisma.orcamentoLead.findUnique({
    where: { id: leadId },
    include: { itens: { orderBy: { createdAt: "asc" } } },
  });
  if (!lead) notFound();

  const isAdmin = token === process.env.ADMIN_TOKEN;
  if (!lead.pago && !isAdmin) {
    redirect(`/orcamento/resultado/${leadId}`);
  }

  const insumosConsolidados = parseInsumos(lead.insumosCalculadosJson);

  const itens: ItemView[] =
    lead.itens.length > 0
      ? lead.itens.map((it) => ({
          atividadeNome: it.atividadeNome,
          unidade: it.unidade,
          quantidade: it.quantidade,
          padraoAcabamento: it.padraoAcabamento,
          categoriaProfissional: it.categoriaProfissional,
          custoMaterialTotal: it.custoMaterialTotal,
          custoMaoObra: it.custoMaoObra,
          custoDireto: it.custoDireto,
          hhTotal: it.hhTotal,
          prazoDias: it.prazoDias,
          insumos: parseInsumos(it.insumosCalculadosJson),
        }))
      : [
          {
            atividadeNome: lead.atividadeNome ?? "Serviço",
            unidade: lead.unidade ?? "un",
            quantidade: lead.quantidade ?? 0,
            padraoAcabamento: lead.padraoAcabamento ?? "medio",
            categoriaProfissional:
              buscarAtividade(lead.atividadeId ?? "")?.categoriaProfissional ??
              "equipe",
            custoMaterialTotal: lead.custoMaterialTotal,
            custoMaoObra: lead.custoMaoObra,
            custoDireto: lead.custoDireto,
            hhTotal: lead.hhTotal,
            prazoDias: lead.prazoDias,
            insumos: insumosConsolidados,
          },
        ];

  const multi = itens.length > 1;

  const moMap = new Map<string, { hh: number; custo: number }>();
  for (const it of itens) {
    const slot = moMap.get(it.categoriaProfissional) ?? { hh: 0, custo: 0 };
    slot.hh += it.hhTotal;
    slot.custo += it.custoMaoObra;
    moMap.set(it.categoriaProfissional, slot);
  }
  const moConsolidada = Array.from(moMap.entries())
    .map(([categoria, { hh, custo }]) => ({ categoria, hh, custo }))
    .sort((a, b) => b.hh - a.hh);

  const numeroPedido = `ORC-${lead.id.slice(-8).toUpperCase()}`;
  const dataFormatada = new Date(lead.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relatorio-pdf min-h-screen bg-cream-50 text-ink-900">
      {/* Header de tela — escondido na impressão */}
      <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-cream-50/95 backdrop-blur print:hidden">
        <div className="container-x flex items-center justify-between py-4">
          <Link
            href={`/orcamento/resultado/${leadId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao orçamento
          </Link>
          <PrintButton />
        </div>
      </header>

      {/* Banner admin */}
      {isAdmin && !lead.pago && (
        <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-amber-900 print:hidden">
          Visualização admin · este lead ainda não pagou
        </div>
      )}

      <main className="container-x py-10 print:py-0">
        <div className="mx-auto max-w-[800px]">
          {/* CAPA */}
          <section className="relatorio-bloco rounded-3xl border border-ink-900/10 bg-white p-8 md:p-12">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                  <Image
                    src="/logos/orcamento/obraradar-icon.jpg"
                    alt="ObraRadar"
                    width={48}
                    height={48}
                    priority
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <p className="display text-lg leading-none text-ink-900">ObraRadar</p>
                  <p className="mt-1.5 text-[10px] tracking-[0.2em] text-ink-500">
                    CALCULADORA DE ORÇAMENTO
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-ink-900/5 px-3 py-1 font-mono text-xs font-bold text-ink-700">
                {numeroPedido}
              </span>
            </div>

            <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
              Relatório de Orçamento
            </p>
            <h1 className="display display-xb mt-3 text-3xl text-ink-900 md:text-4xl">
              {multi
                ? `${itens.length} serviços orçados`
                : itens[0].atividadeNome}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              {lead.nome}
              {lead.email ? ` · ${lead.email}` : ""} · {dataFormatada}
              {lead.cidade ? ` · ${lead.cidade}/` : " · "}
              {lead.uf} · BDI {lead.bdiPercentual}%
            </p>
          </section>

          {/* CUSTO FINAL — fundo dourado com texto navy (sobrevive o @media print global) */}
          <section className="relatorio-bloco mt-8 rounded-3xl bg-gold-500 p-8 text-navy-900 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-900/70">
              Custo final estimado
            </p>
            <p className="display display-xb mt-5 text-5xl leading-tight text-navy-900 md:text-6xl">
              {formatarBRL(lead.custoFinal)}
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-navy-900/25 pt-7 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-navy-900/65">Material</p>
                <p className="display mt-2 text-base text-navy-900">
                  {formatarBRL(lead.custoMaterialTotal)}
                </p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-navy-900/65">Mão de obra</p>
                <p className="display mt-2 text-base text-navy-900">
                  {formatarBRL(lead.custoMaoObra)}
                </p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-navy-900/65">
                  BDI {lead.bdiPercentual}%
                </p>
                <p className="display mt-2 text-base text-navy-900">
                  {formatarBRL(lead.custoFinal - lead.custoDireto)}
                </p>
              </div>
            </div>
          </section>

          {/* SERVIÇOS INCLUÍDOS */}
          <section className="relatorio-bloco mt-8 rounded-3xl border border-ink-900/10 bg-white p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
              {multi ? "Serviços incluídos" : "Serviço orçado"}
            </p>
            <h2 className="display mt-4 text-2xl text-ink-900">
              Composição por serviço
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/10">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Serviço</th>
                    <th className="px-4 py-3 text-right font-bold">Quantidade</th>
                    <th className="px-4 py-3 text-right font-bold">Padrão</th>
                    <th className="px-4 py-3 text-right font-bold">Custo direto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {itens.map((it, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-4 py-3 font-semibold text-ink-900">
                        {it.atividadeNome}
                      </td>
                      <td className="px-4 py-3 text-right text-ink-700">
                        {formatarQuantidade(it.quantidade, it.unidade)}
                      </td>
                      <td className="px-4 py-3 text-right text-ink-700">
                        {rotuloPadrao(it.padraoAcabamento)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-ink-900">
                        {formatarBRL(it.custoDireto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* INSUMOS CONSOLIDADOS */}
          <section className="relatorio-bloco mt-8 rounded-3xl border border-ink-900/10 bg-white p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
              Materiais · base SINAPI 06/2026
            </p>
            <h2 className="display mt-4 text-2xl text-ink-900">
              {multi ? "Lista consolidada de insumos" : "Lista detalhada de insumos"}
            </h2>
            {multi && (
              <p className="mt-3 text-xs text-ink-500">
                Materiais usados em mais de um serviço aparecem somados em uma única linha.
              </p>
            )}

            <div className="mt-7 overflow-hidden rounded-2xl border border-ink-900/10">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Insumo</th>
                    <th className="px-4 py-3 text-right font-bold">Quantidade</th>
                    <th className="px-4 py-3 text-right font-bold">R$/un</th>
                    <th className="px-4 py-3 text-right font-bold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {insumosConsolidados.map((ins) => (
                    <tr key={ins.codigo} className="bg-white">
                      <td className="px-4 py-3 text-ink-900">{ins.descricao}</td>
                      <td className="px-4 py-3 text-right text-ink-700">
                        {formatarQuantidade(ins.qtdeTotal, ins.unidade)}
                      </td>
                      <td className="px-4 py-3 text-right text-ink-700">
                        {formatarBRL(ins.custoUnitarioMedio)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-ink-900">
                        {formatarBRL(ins.custoTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-cream-100">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-ink-500">
                      Total materiais
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-ink-900">
                      {formatarBRL(lead.custoMaterialTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* MÃO DE OBRA POR CATEGORIA */}
          {moConsolidada.length > 0 && (
            <section className="relatorio-bloco mt-8 rounded-3xl border border-ink-900/10 bg-white p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
                Mão de obra
              </p>
              <h2 className="display mt-4 text-2xl text-ink-900">
                Distribuição por categoria profissional
              </h2>

              <div className="mt-7 overflow-hidden rounded-2xl border border-ink-900/10">
                <table className="w-full text-sm">
                  <thead className="bg-cream-100 text-xs uppercase tracking-wider text-ink-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Profissional</th>
                      <th className="px-4 py-3 text-right font-bold">Homem-hora</th>
                      <th className="px-4 py-3 text-right font-bold">Custo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5">
                    {moConsolidada.map((m) => (
                      <tr key={m.categoria} className="bg-white">
                        <td className="px-4 py-3 capitalize font-semibold text-ink-900">
                          {m.categoria}
                        </td>
                        <td className="px-4 py-3 text-right text-ink-700">
                          {m.hh.toFixed(0)} h
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-ink-900">
                          {formatarBRL(m.custo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-cream-100">
                    <tr>
                      <td className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-ink-500">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-bold text-ink-700">
                        {lead.hhTotal.toFixed(0)} h
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-ink-900">
                        {formatarBRL(lead.custoMaoObra)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}

          {/* EQUIPE + PRAZO */}
          <section className="relatorio-bloco mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
                Equipe sugerida
              </p>
              <p className="display mt-4 text-3xl text-ink-900">
                {lead.equipeSugerida} pessoa{lead.equipeSugerida > 1 ? "s" : ""}
              </p>
              <p className="mt-3 text-xs text-ink-500">
                Produtividade RUP nacional de referência.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
                Prazo estimado
              </p>
              <p className="display mt-4 text-3xl text-ink-900">
                {lead.prazoDias} dia{lead.prazoDias > 1 ? "s" : ""} úteis
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                {lead.hhTotal.toFixed(0)} homem-hora · jornada 8h
                {multi ? " · execução sequencial" : ""}
              </p>
            </div>
          </section>

          {multi && (
            <p className="relatorio-bloco mt-6 rounded-2xl border border-ink-900/10 bg-cream-100 px-6 py-5 text-xs leading-relaxed text-ink-700">
              O prazo soma os serviços executados em sequência (uma frente de trabalho). Com equipes paralelas o prazo total pode ser menor.
            </p>
          )}

          {/* RODAPÉ */}
          <footer className="relatorio-bloco mt-10 rounded-2xl border border-ink-900/10 bg-cream-100 p-7 text-xs leading-relaxed text-ink-700">
            <p>
              <strong className="text-ink-900">Fonte de preços:</strong> SINAPI 06/2026
              {" "}(Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil — Caixa).
              Custos de mão de obra calculados sobre salário-base regional × encargos sociais
              (multiplicador 1.835).
            </p>
            <p className="mt-3">
              <strong className="text-ink-900">Aviso técnico:</strong> este orçamento é estimativo e baseado em índices médios de mercado. Os valores reais podem variar conforme método executivo, qualidade dos materiais, condições locais, logística e produtividade da equipe. Não substitui o orçamento detalhado de obra elaborado por profissional habilitado. Sem garantia legal de execução pelo valor indicado.
            </p>
            <p className="mt-4 border-t border-ink-900/10 pt-4 text-ink-500">
              <strong className="text-ink-900">ObraRadar</strong> · Alcazar Engenharia · CNPJ 61.288.947/0001-34 · Maringá/PR ·{" "}
              <a href="https://obraradarapp.com" className="font-semibold text-gold-600">obraradarapp.com</a>
            </p>
          </footer>
        </div>
      </main>

      {/* CSS de impressão — sobrescreve o `* { color: #0b1226 !important }` do
          globals.css APENAS pra esta página, pra preservar destaques dourados e
          o card de custo (texto navy em fundo gold, que de qualquer jeito vira
          navy com a regra global mas preservamos o fundo). */}
      <style>{`
        @media print {
          @page { margin: 14mm 12mm; size: A4; }
          html, body {
            background: #f6f0e3 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .relatorio-pdf {
            background: #f6f0e3 !important;
          }
          /* Preserva fundo dourado do card de custo final */
          .relatorio-pdf .bg-gold-500 {
            background: #c9a574 !important;
          }
          /* Mantém o branco dos cards de conteúdo (sem isso o navegador 'otimiza' pra cream) */
          .relatorio-pdf .bg-white {
            background: #ffffff !important;
          }
          .relatorio-pdf .bg-cream-100 {
            background: #ede5d5 !important;
          }
          /* Quebra de página defensiva */
          .relatorio-bloco {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 12px;
          }
          /* Esconde URL nas links na impressão */
          a[href]::after { content: ""; }
        }
      `}</style>
    </div>
  );
}
