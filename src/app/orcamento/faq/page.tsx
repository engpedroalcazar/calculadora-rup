import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ — ObraRadar Calculadora de Orçamento",
  description:
    "Perguntas frequentes sobre o cálculo de orçamento de obra: SINAPI, encargos sociais, BDI, padrão de acabamento e precisão da estimativa.",
};

const PERGUNTAS: { p: string; r: string }[] = [
  {
    p: "Como o custo de material é calculado?",
    r: "Partimos de um custo base SINAPI nacional por unidade de cada atividade (m², m³, kg, m, un). Esse valor é ajustado por dois multiplicadores: (1) padrão de acabamento escolhido — econômico ×0,85, médio ×1,00, alto ×1,30; e (2) coeficiente de perda física específico da atividade (varia entre 1,00 e 1,15). O resultado é multiplicado pela quantidade informada no quiz.",
  },
  {
    p: "O cálculo da mão de obra inclui encargos sociais?",
    r: "Sim. Usamos um multiplicador de 1,835 sobre o salário-base regional. Esse multiplicador é a média de mercado para construção civil CLT e cobre FGTS, INSS patronal, férias, 13º salário, vale-transporte, vale-refeição e provisões trabalhistas (rescisão e licenças).",
  },
  {
    p: "Por que o custo varia por estado?",
    r: "Cada UF tem um fator regional aplicado sobre o salário-base nacional do profissional. SP, RJ e DF têm fator 1,18–1,20 (mais caros); estados do Norte e Nordeste, fator 0,80–0,95 (mais baratos). Esse fator é calibrado com base no CUB regional e em convenções coletivas dos sindicatos estaduais da construção civil.",
  },
  {
    p: "O que é BDI e como ele afeta o orçamento?",
    r: "BDI (Bonificação e Despesas Indiretas) é a margem aplicada sobre o custo direto (material + mão de obra). Ela cobre lucro, impostos sobre faturamento, despesas administrativas e imprevistos. Para obra residencial pequena/média, a faixa de mercado é 20% a 30%. No quiz, você pode ajustar entre 0% e 50%.",
  },
  {
    p: "Qual a diferença entre os 3 padrões de acabamento?",
    r: "Econômico (×0,85): blocos cerâmicos comuns, argamassa industrializada simples, pisos cerâmicos básicos, gesso liso. Médio (×1,00): padrão de mercado, materiais consolidados como porcelanato 60×60, gesso acartonado, textura acrílica. Alto (×1,30): porcelanato 90×90+, pastilhas, esquadrias premium, tintas com maior cobertura.",
  },
  {
    p: "O orçamento é exato ou é uma estimativa?",
    r: "É uma estimativa técnica calibrada. A precisão é boa o suficiente pra você decidir se segue com a obra, comparar propostas de empreiteiros e dimensionar capital de giro. Mas não substitui orçamento detalhado de fornecedor pra contratos de execução — pra isso, peça cotação direta de pelo menos 3 fornecedores na sua região.",
  },
  {
    p: "Posso usar pra contratar empreiteiro?",
    r: "Como base de negociação, sim. Use o valor calculado como teto de referência: se o empreiteiro pedir mais que 15% acima, peça justificativa item a item. Se pedir muito abaixo, desconfie — pode ter material de baixa qualidade ou mão de obra sem encargos, o que dá problema depois.",
  },
  {
    p: "Posso orçar várias atividades juntas?",
    r: "Hoje (versão atual), o quiz orça uma atividade por vez. Em breve, vamos liberar combos — você poderá montar pacotes complementares, como alvenaria + verga/contraverga + chapisco + emboço numa única simulação. Avisaremos por e-mail assim que esta função estiver disponível.",
  },
  {
    p: "O que vou receber no relatório completo?",
    r: "Em breve, o relatório técnico completo trará: detalhamento de material por componente, lista de insumos com unidade e preço unitário SINAPI, dimensionamento de equipe (quantidade por categoria profissional), prazo de execução em dias úteis, cronograma estimado e versão em PDF pra anexar em propostas comerciais.",
  },
  {
    p: "Como vocês usam meus dados?",
    r: "Seu nome e e-mail são usados pra enviar a cópia do orçamento gerado e avisar quando o relatório completo estiver disponível. Não compartilhamos com terceiros, não vendemos lista. Você pode pedir exclusão por e-mail a qualquer momento.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <BrandHeader variant="inner" />

      <main className="container-x flex-1 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="t-label">Perguntas frequentes</p>
          <h1 className="display display-xb mt-3 text-4xl text-cream-50 md:text-5xl">
            Tire suas dúvidas
          </h1>
          <p className="mt-4 text-base text-[var(--fg-on-dark-muted)]">
            Como o motor funciona, o que está incluso no cálculo e até onde
            podemos te ajudar na decisão da obra.
          </p>

          <div className="mt-10 space-y-3">
            {PERGUNTAS.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-[var(--navy-line)] bg-navy-800 p-6 transition-colors hover:border-gold-500/40"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="display text-base text-cream-50 md:text-lg">
                    {item.p}
                  </span>
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/50 text-xs font-bold text-gold-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-[var(--fg-on-dark-muted)]">
                  {item.r}
                </p>
              </details>
            ))}
          </div>

          {/* CTA final */}
          <div className="mt-14 rounded-3xl border border-gold-500/30 bg-[var(--gold-soft)]/30 p-8 text-center md:p-10">
            <p className="t-label">Ainda com dúvida?</p>
            <h2 className="display display-xb mt-3 text-2xl text-cream-50 md:text-3xl">
              Fale com a gente
            </h2>
            <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
              Se a resposta não tá aqui, abre uma conversa pelo Suporte —
              respondemos em até 1 dia útil.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/orcamento/suporte" className="btn-cta">
                Ir pro Suporte
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/orcamento/orcar" className="btn-ghost">
                Calcular meu orçamento
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
