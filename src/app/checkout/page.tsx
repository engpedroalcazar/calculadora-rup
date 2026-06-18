"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Check, Loader2 } from "lucide-react";

const PLANOS = [
  {
    id: "individual",
    nome: "Individual",
    preco: 39.9,
    destaque: false,
    descricao: "Análise de 1 atividade",
    itens: [
      "Relatório completo de 1 frente de serviço",
      "RUP real, referência e desvio detalhados",
      "HH total e custo estimado",
      "Diagnóstico automático com causas e ações",
    ],
  },
  {
    id: "pacote",
    nome: "Pacote 10 Atividades",
    preco: 249.9,
    destaque: true,
    descricao: "Até 10 frentes de serviço",
    economia: "Economia de R$ 149,00",
    itens: [
      "Tudo do plano Individual",
      "Até 10 análises de atividades diferentes",
      "Ideal para múltiplas frentes de serviço",
      "Validade de 30 dias para uso",
    ],
  },
] as const;

type PlanoId = typeof PLANOS[number]["id"];

const inclusos = [
  "RUP real calculada e RUP de referência",
  "HH total consumido na atividade",
  "Custo estimado de mão de obra",
  "Perda estimada em relação à referência",
  "Diagnóstico automático detalhado",
  "Causas mais prováveis do desvio",
  "Ações recomendadas para correção",
  "Nível de confiabilidade da análise",
];

function CheckoutConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [plano, setPlano] = useState<PlanoId>("individual");
  void router;

  const planoSelecionado = PLANOS.find((p) => p.id === plano)!;
  const preco = planoSelecionado.preco;

  async function confirmar() {
    if (!id) return;
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`/api/checkout/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano, valor: preco }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no pagamento");
      window.location.assign(data.url);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao processar pagamento");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-900" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header — padrão visual do Orçamento (selo do radar + navy) */}
      <header
        className="sticky top-0 z-50 border-b border-[var(--navy-line)]"
        style={{ background: "rgba(11,18,38,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px]">
              <Image src="/logos/orcamento/obraradar-icon.jpg" alt="Obra Radar" width={36} height={36} className="h-9 w-9 object-cover" />
            </span>
            <span className="display text-sm text-cream-50" style={{ letterSpacing: "0.04em" }}>OBRA RADAR</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--fg-on-dark-muted)]">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Pagamento seguro
          </div>
        </div>
      </header>

      <main className="container-x flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/resultado?id=${id}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--fg-on-dark-muted)] transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o resultado
          </Link>
          <p className="t-label mt-6">Pagamento · laudo RUP</p>
          <h1 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
            Escolha seu plano
          </h1>
          <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
            Selecione a opção que melhor se encaixa na sua necessidade.
          </p>
        </div>

        {/* Cartão creme — identidade do Orçamento */}
        <div
          className="mx-auto mt-10 max-w-3xl rounded-3xl bg-cream-50 p-6 text-ink-900 md:p-10"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Seleção de planos */}
          <div className="grid gap-4 sm:grid-cols-2">
            {PLANOS.map((p) => {
              const selecionado = plano === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlano(p.id)}
                  className={`relative rounded-2xl border-2 p-5 text-left transition ${
                    selecionado
                      ? "border-gold-500 bg-[var(--gold-soft)]"
                      : "border-ink-700/15 bg-white hover:border-gold-500/40"
                  }`}
                >
                  {p.destaque && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                      Melhor custo-benefício
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="display text-lg text-ink-900">{p.nome}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{p.descricao}</p>
                    </div>
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        selecionado ? "border-gold-500 bg-gold-500" : "border-ink-700/25 bg-white"
                      }`}
                    >
                      {selecionado && <Check className="h-3 w-3 text-navy-900" strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="display mt-3 text-3xl text-ink-900">
                    R$ {p.preco.toFixed(2).replace(".", ",")}
                  </p>
                  {"economia" in p ? (
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {p.economia}
                    </p>
                  ) : (
                    <div className="mt-1 h-4" />
                  )}
                  <ul className="mt-4 grid gap-2">
                    {p.itens.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-ink-700">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* O que está incluso */}
          <div className="mt-6 rounded-2xl border border-ink-700/10 bg-white p-6">
            <p className="t-label t-label-on-cream">O que você recebe em cada relatório</p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {inclusos.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resumo */}
          <div className="mt-6 rounded-2xl bg-[var(--gold-soft)] p-6">
            <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
              <span className="text-sm text-ink-700">
                {planoSelecionado.nome} · {planoSelecionado.descricao}
              </span>
              <span className="font-bold text-ink-900">R$ {preco.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="display text-base text-ink-900">TOTAL</span>
              <span className="display text-3xl text-gold-600">R$ {preco.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          {/* Forma de pagamento */}
          <div className="mt-6 rounded-2xl border border-ink-700/10 bg-white p-6">
            <p className="t-label t-label-on-cream">Forma de pagamento</p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 px-4 py-3">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-sm font-semibold text-ink-900">Pix / Cartão de crédito</span>
            </div>
            <p className="mt-2 text-center text-xs text-ink-400">
              Pix e cartão de crédito via Mercado Pago
            </p>
          </div>

          {erro && (
            <div
              className="mt-4 rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(201,90,74,0.3)", background: "rgba(201,90,74,0.1)", color: "var(--sev-critico)" }}
            >
              {erro}
            </div>
          )}

          <button
            onClick={confirmar}
            disabled={loading || !id}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "var(--cta-500)", boxShadow: loading || !id ? "none" : "var(--cta-glow)", letterSpacing: "0.03em" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              `Confirmar · R$ ${preco.toFixed(2).replace(".", ",")}`
            )}
          </button>
          <p className="mt-3 text-center text-xs text-ink-400">
            Acesso imediato ao relatório após confirmação.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy-900">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      }
    >
      <CheckoutConteudo />
    </Suspense>
  );
}
