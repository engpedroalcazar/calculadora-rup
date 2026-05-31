import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Lock,
  CheckCircle2,
  FileDown,
  Users,
  Clock3,
  Receipt,
  ArrowLeft,
  Package,
} from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";
import { prisma } from "@/lib/db";
import {
  formatarBRL,
  formatarQuantidade,
  type InsumoCalculado,
} from "@/lib/orcamento/calculo";
import { DevUnlockButton } from "./DevUnlockButton";

type Props = { params: Promise<{ leadId: string }> };

const PREVIA_VISIVEL = 3;

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

export default async function ResultadoPage({ params }: Props) {
  const { leadId } = await params;

  const lead = await prisma.orcamentoLead.findUnique({ where: { id: leadId } });
  if (!lead) notFound();

  const insumos = parseInsumos(lead.insumosCalculadosJson);
  const previaInsumos = insumos.slice(0, PREVIA_VISIVEL);
  const insumosOcultos = insumos.slice(PREVIA_VISIVEL);
  const totalInsumosOcultos = insumosOcultos.length;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <BrandHeader variant="inner" />

      <main className="container-x flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/orcamento/orcar"
            className="inline-flex items-center gap-2 text-sm text-[var(--fg-on-dark-muted)] hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" /> Fazer outro orçamento
          </Link>

          <p className="t-label mt-6">
            Orçamento {lead.pago ? "completo" : "gerado · prévia gratuita"}
          </p>
          <h1 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
            {lead.pago ? "Seu relatório técnico" : "Seu orçamento está pronto"}
          </h1>
          <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
            {lead.quantidade.toLocaleString("pt-BR")} {lead.unidade} ·{" "}
            {lead.atividadeNome} · {lead.cidade ? `${lead.cidade}/` : ""}
            {lead.uf} · padrão {rotuloPadrao(lead.padraoAcabamento)}
          </p>
        </div>

        {/* Card principal — custo final, sempre visível */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div
            className="rounded-3xl bg-cream-50 p-8 text-ink-900 md:p-12"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="rounded-2xl bg-navy-900 p-8 text-cream-50 md:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                Custo final estimado
              </p>
              <p className="display display-xb mt-4 text-5xl text-cream-50 md:text-7xl">
                {formatarBRL(lead.custoFinal)}
              </p>
              <p className="mt-4 text-base text-[var(--fg-on-dark-muted)]">
                {formatarBRL(lead.custoPorUnidade)} por {lead.unidade}
              </p>
            </div>

            {/* Lista de insumos — sempre tem 3 visíveis; o restante muda conforme pago/não-pago */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-gold-600">
                <Receipt className="h-5 w-5" />
                <p
                  className="t-label t-label-on-cream"
                  style={{ color: "inherit" }}
                >
                  Materiais necessários · base SINAPI 06/2026
                </p>
              </div>
              <h2 className="display mt-3 text-2xl text-ink-900">
                Lista detalhada de insumos
              </h2>

              {/* Prévia (3 primeiros) */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink-700/10">
                <table className="w-full text-sm">
                  <thead className="bg-ink-900/5 text-xs uppercase tracking-wider text-ink-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Insumo</th>
                      <th className="px-4 py-3 text-right font-bold">Quantidade</th>
                      <th className="px-4 py-3 text-right font-bold">R$/un</th>
                      <th className="px-4 py-3 text-right font-bold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/10">
                    {previaInsumos.map((ins) => (
                      <tr key={ins.codigo}>
                        <td className="px-4 py-3 text-ink-900">{ins.descricao}</td>
                        <td className="px-4 py-3 text-right text-ink-700">
                          {formatarQuantidade(ins.qtdeTotal, ins.unidade)}
                        </td>
                        <td className="px-4 py-3 text-right text-ink-700">
                          {lead.pago ? (
                            formatarBRL(ins.custoUnitarioMedio)
                          ) : (
                            <span className="inline-block rounded bg-ink-900/10 px-2 py-0.5 text-xs text-ink-400">
                              R$ ••••
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-ink-900">
                          {lead.pago ? (
                            formatarBRL(ins.custoTotal)
                          ) : (
                            <span className="inline-block rounded bg-ink-900/10 px-2 py-0.5 text-xs text-ink-400">
                              R$ ••••
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {/* Linhas restantes: borradas (paywall) ou completas (pago) */}
                    {lead.pago
                      ? insumosOcultos.map((ins) => (
                          <tr key={ins.codigo}>
                            <td className="px-4 py-3 text-ink-900">
                              {ins.descricao}
                            </td>
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
                        ))
                      : insumosOcultos.slice(0, 4).map((ins, i) => (
                          <tr key={ins.codigo} aria-hidden>
                            <td
                              className="px-4 py-3 text-ink-900 select-none"
                              style={{ filter: "blur(6px)" }}
                            >
                              {ins.descricao}
                            </td>
                            <td
                              className="px-4 py-3 text-right text-ink-700 select-none"
                              style={{ filter: "blur(6px)" }}
                            >
                              {formatarQuantidade(ins.qtdeTotal, ins.unidade)}
                            </td>
                            <td
                              className="px-4 py-3 text-right text-ink-700 select-none"
                              style={{ filter: "blur(6px)" }}
                            >
                              R$ {(50 + i * 7).toFixed(2)}
                            </td>
                            <td
                              className="px-4 py-3 text-right font-bold text-ink-900 select-none"
                              style={{ filter: "blur(6px)" }}
                            >
                              R$ {(120 + i * 35).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              {!lead.pago && totalInsumosOcultos > 0 && (
                <p className="mt-3 text-xs text-ink-500">
                  +{totalInsumosOcultos} insumo{totalInsumosOcultos > 1 ? "s" : ""}{" "}
                  no relatório completo — incluindo preço unitário SINAPI de cada
                  item.
                </p>
              )}
            </div>

            {/* PAYWALL — só aparece se não pago */}
            {!lead.pago && (
              <div className="mt-10 rounded-2xl border-2 border-dashed border-gold-500/40 bg-[var(--gold-soft)] p-8 md:p-10">
                <div className="flex items-start gap-3">
                  <Lock className="mt-1 h-6 w-6 text-gold-600" />
                  <div>
                    <p
                      className="t-label t-label-on-cream"
                      style={{ color: "var(--color-gold-600)" }}
                    >
                      Relatório completo
                    </p>
                    <h3 className="display mt-2 text-2xl text-ink-900">
                      Destrave o detalhamento técnico completo
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">
                      Lista completa dos {insumos.length} insumos com{" "}
                      <strong>preço unitário SINAPI</strong>, dimensionamento
                      da equipe, prazo em dias úteis, total de homem-hora,
                      breakdown material/MO/BDI e exportação em PDF.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  {/* Plano individual */}
                  <button
                    type="button"
                    disabled
                    title="Pagamento será habilitado no lançamento (Iter #6)"
                    className="group cursor-not-allowed rounded-2xl border border-ink-900/10 bg-white p-6 text-left opacity-95 transition hover:border-gold-500"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold uppercase tracking-wider text-ink-500">
                        Este relatório
                      </p>
                      <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-500">
                        em breve
                      </span>
                    </div>
                    <p className="display mt-4 text-4xl text-ink-900">
                      R$ 29,90
                    </p>
                    <p className="mt-2 text-xs text-ink-500">
                      pagamento único · acesso permanente
                    </p>
                  </button>

                  {/* Pacote 10× */}
                  <button
                    type="button"
                    disabled
                    title="Pagamento será habilitado no lançamento (Iter #6)"
                    className="group cursor-not-allowed rounded-2xl border-2 border-gold-500 bg-navy-900 p-6 text-left text-cream-50 transition hover:border-gold-400"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
                        Pacote 10 relatórios
                      </p>
                      <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-500">
                        economize 50%
                      </span>
                    </div>
                    <p className="display mt-4 text-4xl text-cream-50">
                      R$ 149,90
                    </p>
                    <p className="mt-2 text-xs text-[var(--fg-on-dark-muted)]">
                      10 destravamentos · R$ 14,99 por relatório
                    </p>
                  </button>
                </div>

                <p className="mt-5 text-center text-xs text-ink-500">
                  Pagamentos via Mercado Pago serão habilitados no lançamento. Por
                  enquanto, fique tranquilo — seu orçamento está salvo e você
                  receberá um aviso por e-mail.
                </p>

                {isDev && <DevUnlockButton leadId={lead.id} />}
              </div>
            )}

            {/* RELATÓRIO COMPLETO — só aparece se pago */}
            {lead.pago && (
              <div className="mt-10 space-y-8">
                {/* Breakdown financeiro */}
                <div>
                  <h3 className="display text-xl text-ink-900">
                    Composição do custo
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-ink-700/10 bg-white p-5">
                      <p className="text-xs uppercase tracking-wider text-ink-500">
                        Material
                      </p>
                      <p className="display mt-2 text-2xl text-ink-900">
                        {formatarBRL(lead.custoMaterialTotal)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-ink-700/10 bg-white p-5">
                      <p className="text-xs uppercase tracking-wider text-ink-500">
                        Mão de obra
                      </p>
                      <p className="display mt-2 text-2xl text-ink-900">
                        {formatarBRL(lead.custoMaoObra)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-ink-700/10 bg-white p-5">
                      <p className="text-xs uppercase tracking-wider text-ink-500">
                        BDI ({lead.bdiPercentual}%)
                      </p>
                      <p className="display mt-2 text-2xl text-ink-900">
                        {formatarBRL(lead.custoFinal - lead.custoDireto)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Equipe e prazo */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-ink-700/10 bg-white p-5">
                    <Users className="mt-0.5 h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink-500">
                        Equipe sugerida
                      </p>
                      <p className="display mt-1 text-xl text-ink-900">
                        {lead.equipeSugerida} pessoa
                        {lead.equipeSugerida > 1 ? "s" : ""}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        produtividade RUP nacional
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-ink-700/10 bg-white p-5">
                    <Clock3 className="mt-0.5 h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-ink-500">
                        Prazo estimado
                      </p>
                      <p className="display mt-1 text-xl text-ink-900">
                        {lead.prazoDias} dia
                        {lead.prazoDias > 1 ? "s" : ""} úteis
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        {lead.hhTotal.toFixed(0)} homem-hora · jornada 8h
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-2xl bg-navy-900/5 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                  <div className="flex items-center gap-3">
                    <FileDown className="h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-sm font-bold text-ink-900">
                        Exportar relatório em PDF
                      </p>
                      <p className="text-xs text-ink-500">
                        Em breve · disponível na próxima atualização (Iter #5).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-full bg-ink-900/10 px-5 py-2 text-sm font-bold text-ink-500"
                  >
                    Em breve
                  </button>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-[var(--gold-soft)] p-5">
                  <Package className="mt-0.5 h-5 w-5 text-gold-600" />
                  <div>
                    <p className="text-sm font-bold text-ink-900">
                      Tem mais obras pra orçar?
                    </p>
                    <p className="mt-1 text-xs text-ink-700">
                      Pacote 10 relatórios por R$ 149,90 (50% off) será liberado
                      junto com pagamentos no lançamento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmação acima do paywall (só se pago) */}
            {lead.pago && (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-4 text-sm text-ink-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <p>
                  Relatório completo liberado. Uma cópia foi enviada para{" "}
                  <strong>{lead.email}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
