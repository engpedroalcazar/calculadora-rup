import Link from "next/link";
import {
  ArrowRight,
  Ruler,
  MapPin,
  Sliders,
  Receipt,
  Search,
  ShieldCheck,
  Clock3,
  BadgePercent,
  FileBarChart2,
} from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900">
      <BrandHeader />

      <main>
        {/* HERO — tipografia financeira como elemento visual */}
        <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="t-label">Orçamento de obra · base SINAPI 2026</p>
            <h1 className="display display-xb mt-5 text-5xl text-cream-50 md:text-6xl lg:text-7xl">
              Quanto sua obra vai{" "}
              <span className="text-gold-500">custar de verdade</span>?
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--fg-on-dark-muted)]">
              Em 5 etapas guiadas você sai com o valor estimado da sua obra —
              material, mão de obra com encargos, BDI e prazo de execução
              calibrados por estado. Sem planilha, sem orçamento de boca.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/orcamento/orcar" className="btn-cta">
                Calcular meu orçamento
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--fg-on-dark-muted)]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-500" />
                SINAPI atualizado
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-gold-500" />
                Resultado em 5 minutos
              </li>
              <li className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-gold-500" />
                Fator regional por UF
              </li>
            </ul>
          </div>

          {/* Card de exemplo — número como referência, não como dominante */}
          <div
            className="rounded-3xl bg-cream-50 p-8 text-ink-900 md:p-10"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="t-label t-label-on-cream">Exemplo de cálculo</p>
                <p className="mt-2 text-sm font-semibold text-ink-700">
                  Alvenaria bloco cerâmico 14 cm
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  120 m² · São Paulo · padrão médio · BDI 25%
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-navy-900 p-7 text-cream-50">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-500">
                Custo final estimado
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <p className="display display-xb text-4xl text-cream-50 md:text-5xl">
                  R$ 14.955
                </p>
                <p className="text-sm text-[var(--fg-on-dark-muted)]">
                  ≈ R$&nbsp;124,63/m²
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--navy-line)] pt-5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--fg-on-dark-muted)]">
                    Material
                  </p>
                  <p className="mt-1 text-sm font-bold text-cream-50">R$ 9.240</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--fg-on-dark-muted)]">
                    Mão de obra
                  </p>
                  <p className="mt-1 text-sm font-bold text-cream-50">R$ 2.724</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--fg-on-dark-muted)]">
                    BDI 25%
                  </p>
                  <p className="mt-1 text-sm font-bold text-gold-500">R$ 2.991</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="display text-2xl text-ink-900">76</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">
                  atividades
                </p>
              </div>
              <div className="border-x border-ink-700/10">
                <p className="display text-2xl text-ink-900">26</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">
                  estados
                </p>
              </div>
              <div>
                <p className="display text-2xl text-ink-900">3</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">
                  padrões
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA — timeline horizontal das 5 etapas (diferente do RUP) */}
        <section className="bg-cream-50 py-20 text-ink-900">
          <div className="container-x">
            <p className="t-label t-label-on-cream">Como funciona</p>
            <h2 className="display display-xb mt-3 text-3xl md:text-4xl">
              Cinco etapas, cinco minutos
            </h2>
            <p className="mt-3 max-w-2xl text-base text-ink-500">
              Você responde, a gente calcula. Sem cadastro complicado, sem upload de planilha, sem reunião.
            </p>

            <div className="mt-14">
              <ol className="grid gap-5 md:grid-cols-5">
                {[
                  { n: 1, icon: Search, titulo: "Serviço", desc: "Busca entre 76 atividades agrupadas por etapa da obra" },
                  { n: 2, icon: Ruler, titulo: "Quantidade", desc: "Informa m², m³, kg ou unidade conforme o serviço" },
                  { n: 3, icon: MapPin, titulo: "Local", desc: "Estado da obra para ajustar custo regional" },
                  { n: 4, icon: Sliders, titulo: "Padrão", desc: "Econômico, médio ou alto + percentual de BDI" },
                  { n: 5, icon: FileBarChart2, titulo: "Resultado", desc: "Custo final estimado, por unidade e detalhamento técnico" },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.n}
                      className="relative rounded-2xl border border-ink-700/10 bg-white p-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="display flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-base text-gold-500">
                          {step.n}
                        </span>
                        <Icon className="h-5 w-5 text-gold-600" />
                      </div>
                      <p className="display mt-4 text-lg text-ink-900">{step.titulo}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/orcamento/orcar" className="btn-cta">
                Começar agora
                <Receipt className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* O QUE ESTÁ POR TRÁS — credibilidade técnica */}
        <section id="base-tecnica" className="py-20">
          <div className="container-x grid gap-12 lg:grid-cols-2">
            <div>
              <p className="t-label">Base técnica</p>
              <h2 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
                Mesmo banco que move a Calculadora RUP
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--fg-on-dark-muted)]">
                A ObraRadar opera no setor de produtividade da construção civil desde 2024. A Calculadora de Orçamento reaproveita o mesmo banco de 76 atividades já validado em produção — agora com camada de custo SINAPI e fator regional por UF.
              </p>
              <p className="mt-5 text-base leading-relaxed text-[var(--fg-on-dark-muted)]">
                Mão de obra calculada com salário-base por categoria profissional (pedreiro, carpinteiro, armador, eletricista, encanador, pintor, azulejista), ajustada pelo fator regional do estado e multiplicada pelo coeficiente de encargos sociais (1,835).
              </p>
            </div>

            <div className="grid gap-4">
              <Card titulo="Material" desc="Base SINAPI nacional, ajustada por padrão de acabamento (×0,85 econômico, ×1,00 médio, ×1,30 alto) e coeficiente de perda física por atividade." />
              <Card titulo="Mão de obra" desc="HH-total × custo hora-homem regional, já com encargos sociais (FGTS, INSS, férias, 13º, vale-transporte e provisões trabalhistas)." />
              <Card titulo="BDI" desc="Aplicado sobre o custo direto. Padrão de mercado para obra residencial pequena/média: 20% a 30%. Personalizável no quiz." />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Card({ titulo, desc }: { titulo: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[var(--navy-line)] bg-navy-800 p-6">
      <p className="display text-xl text-gold-500">{titulo}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--fg-on-dark-muted)]">{desc}</p>
    </div>
  );
}
