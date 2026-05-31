import type { Metadata } from "next";
import Link from "next/link";
import { Mail, HelpCircle, Lightbulb, MessageCircle } from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";

export const metadata: Metadata = {
  title: "Suporte — ObraRadar Calculadora de Orçamento",
  description:
    "Canais de atendimento da ObraRadar: e-mail, dúvidas frequentes e contato direto. Respondemos em até 1 dia útil.",
};

const CANAIS = [
  {
    icon: Mail,
    titulo: "E-mail",
    desc: "Para dúvidas, reportar erro no cálculo ou pedir suporte técnico",
    acao: "eng.pedroalcazar@gmail.com",
    href: "mailto:eng.pedroalcazar@gmail.com",
  },
  {
    icon: HelpCircle,
    titulo: "Perguntas frequentes",
    desc: "10 respostas sobre SINAPI, encargos, BDI, padrão de acabamento e precisão do cálculo",
    acao: "Ver FAQ completo",
    href: "/orcamento/faq",
  },
  {
    icon: Lightbulb,
    titulo: "Sugestão de atividade",
    desc: "Quer que a gente inclua uma atividade que não está no catálogo? Manda pra gente",
    acao: "eng.pedroalcazar@gmail.com",
    href: "mailto:eng.pedroalcazar@gmail.com?subject=Sugest%C3%A3o%20de%20atividade",
  },
  {
    icon: MessageCircle,
    titulo: "Reportar inconsistência",
    desc: "Achou um valor que destoa muito da realidade da sua região? Avise — calibramos o motor a cada lote de feedback",
    acao: "eng.pedroalcazar@gmail.com",
    href: "mailto:eng.pedroalcazar@gmail.com?subject=Inconsist%C3%AAncia%20no%20c%C3%A1lculo",
  },
];

export default function SuportePage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <BrandHeader variant="inner" />

      <main className="container-x flex-1 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="t-label">Estamos aqui</p>
          <h1 className="display display-xb mt-3 text-4xl text-cream-50 md:text-5xl">
            Como podemos ajudar?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--fg-on-dark-muted)]">
            A ObraRadar é uma equipe pequena e focada — você fala direto com
            engenharia. Tempo médio de resposta: 1 dia útil.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {CANAIS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.titulo}
                  href={c.href}
                  className="group rounded-2xl border border-[var(--navy-line)] bg-navy-800 p-7 transition-all hover:border-gold-500/40 hover:bg-navy-700"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold-soft)]">
                    <Icon className="h-5 w-5 text-gold-500" />
                  </div>
                  <p className="display mt-5 text-xl text-cream-50">{c.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fg-on-dark-muted)]">
                    {c.desc}
                  </p>
                  <p className="mt-5 text-sm font-bold text-gold-500 transition-colors group-hover:text-gold-400">
                    {c.acao} →
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Bloco de informações da empresa */}
          <div className="mt-14 rounded-3xl bg-cream-50 p-8 text-ink-900 md:p-10">
            <p className="t-label t-label-on-cream">Quem está por trás</p>
            <h2 className="display display-xb mt-3 text-2xl text-ink-900 md:text-3xl">
              P H Alcazar Brito Engenharia
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              A ObraRadar é uma marca digital da Alcazar Engenharia, escritório
              de engenharia civil sediado em Maringá/PR. Construímos
              ferramentas práticas pra quem decide com número — não com achismo.
            </p>
            <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-400">
                  Razão social
                </dt>
                <dd className="mt-1 font-semibold text-ink-700">
                  P H Alcazar Brito Engenharia
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-400">
                  CNPJ
                </dt>
                <dd className="mt-1 font-semibold text-ink-700">
                  61.288.947/0001-34
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-400">
                  Sede
                </dt>
                <dd className="mt-1 font-semibold text-ink-700">Maringá / PR</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-400">
                  E-mail
                </dt>
                <dd className="mt-1 font-semibold text-ink-700">
                  eng.pedroalcazar@gmail.com
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
