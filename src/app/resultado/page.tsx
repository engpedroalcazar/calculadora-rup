"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Lock, Check, ArrowRight, Loader2, HardHat } from "lucide-react";

interface ResultadoData {
  id: string; severidade: string; desvio: number;
  rupReal: number; rupRef: number; hhTotal: number;
  atividadeNome: string; unidade: string;
}

const inclusos = [
  "RUP real calculada e RUP de referência",
  "Desvio percentual em relação ao benchmark",
  "HH total consumido na atividade",
  "Custo estimado de mão de obra",
  "Perda estimada em relação à referência",
  "Diagnóstico automático detalhado",
  "Causas mais prováveis do desvio",
  "Ações recomendadas para correção",
];

function ResultadoConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [data, setData] = useState<ResultadoData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("rup_resultado");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única de localStorage no mount; dado não existe no render inicial (SSR)
        if (!id || parsed.id === id) { setData(parsed); return; }
      } catch { /* ignore */ }
    }
    router.push("/diagnostico");
  }, [id, router]);

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900">
      <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
    </div>
  );

  const preco = Number(process.env.NEXT_PUBLIC_PRECO ?? 39.9);

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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Análise concluída
          </div>
        </div>
      </header>

      <main className="container-x flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="t-label">Diagnóstico RUP · resultado</p>
          <h1 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
            Seu diagnóstico está pronto
          </h1>
          <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
            Os indicadores estão bloqueados até a liberação do laudo completo.
          </p>
        </div>

        {/* Cartão creme — identidade do Orçamento */}
        <div
          className="mx-auto mt-10 max-w-2xl rounded-3xl bg-cream-50 p-6 text-ink-900 md:p-10"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Atividade analisada */}
          <div className="flex items-center gap-3 rounded-2xl border border-ink-700/10 bg-white p-5">
            <HardHat className="h-5 w-5 flex-shrink-0 text-gold-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-600">
                Atividade analisada
              </p>
              <p className="mt-0.5 font-bold text-ink-900">{data.atividadeNome}</p>
            </div>
          </div>

          {/* Indicadores bloqueados */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-ink-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.12em]">Indicadores bloqueados</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Severidade", "Desvio %", "RUP real", "HH total", "Custo estimado", "Perda estimada"].map((label) => (
                <div key={label} className="relative overflow-hidden rounded-xl border border-ink-700/10 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">{label}</p>
                  <p className="mt-1 select-none text-2xl text-ink-900/10" style={{ filter: "blur(6px)" }}>00,0</p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-ink-400/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paywall — destravar laudo */}
          <div className="mt-8 rounded-2xl border-2 border-dashed border-gold-500/40 bg-[var(--gold-soft)] p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-gold-600" />
              <div>
                <p className="t-label t-label-on-cream" style={{ color: "var(--gold-600)" }}>
                  Laudo técnico completo
                </p>
                <h3 className="display mt-2 text-2xl text-ink-900">
                  Destrave o diagnóstico completo
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Todos os indicadores, o diagnóstico detalhado, as causas mais
                  prováveis do desvio e as ações recomendadas para corrigir.
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {inclusos.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink-400">A partir de</p>
                <p className="display text-4xl text-ink-900">
                  R$ {preco.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <p className="max-w-[160px] text-right text-xs text-ink-400">
                Acesso imediato após o pagamento
              </p>
            </div>

            <Link
              href={`/checkout?id=${data.id}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition"
              style={{ background: "var(--cta-500)", boxShadow: "var(--cta-glow)", letterSpacing: "0.03em" }}
            >
              Liberar meu laudo completo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-3 text-center text-xs text-ink-400">
              Pagamento seguro via Pix ou cartão
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/diagnostico" className="text-sm text-ink-400 transition-colors hover:text-ink-700">
              Analisar outra atividade
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy-900">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      }
    >
      <ResultadoConteudo />
    </Suspense>
  );
}
