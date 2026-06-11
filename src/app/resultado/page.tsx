"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(243,236,222,0.1)", borderTop: "2px solid var(--gold-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const preco = Number(process.env.NEXT_PUBLIC_PRECO ?? 39.9);

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/assets/obraradar-mark-clean.png" alt="ObraRadar" width={48} height={30} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>OBRA RADAR</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--cta-500)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12l5 5L20 6"/></svg>
            Análise concluída
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Confirmação */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 36px)", color: "#f3ecde", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
            Diagnóstico pronto!
          </h1>
          <p style={{ fontSize: 15, color: "rgba(243,236,222,0.6)", margin: 0 }}>
            Sua análise foi processada. Os resultados estão bloqueados até a liberação.
          </p>
        </div>

        {/* Atividade analisada */}
        <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(243,236,222,0.04)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-500)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-500)" }}>Atividade analisada</p>
            <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 15, color: "#f3ecde" }}>{data.atividadeNome}</p>
          </div>
        </div>

        {/* Bloqueio visual */}
        <div style={{ marginBottom: 24, padding: 24, background: "rgba(243,236,222,0.02)", border: "1px solid rgba(243,236,222,0.08)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(243,236,222,0.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ fontSize: 12, color: "rgba(243,236,222,0.4)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Resultados bloqueados</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {["Severidade", "Desvio %", "RUP Real", "HH Total", "Custo estimado", "Perda estimada"].map((label) => (
              <div key={label} style={{ position: "relative", padding: "14px 16px", background: "rgba(243,236,222,0.03)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <p style={{ margin: "0 0 6px", fontSize: 10, color: "rgba(243,236,222,0.35)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</p>
                <p style={{ margin: 0, fontSize: 22, fontFamily: "var(--font-display)", color: "rgba(243,236,222,0.08)", filter: "blur(6px)", userSelect: "none" }}>—</p>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(243,236,222,0.2)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA unlock */}
        <div style={{ padding: 28, background: "rgba(201,165,116,0.07)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 18, color: "#f3ecde", letterSpacing: "0.03em" }}>RELATÓRIO COMPLETO</p>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(243,236,222,0.65)", marginBottom: 18 }}>
            Libere todos os indicadores, o diagnóstico detalhado, causas prováveis e ações recomendadas.
          </p>
          <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
            {inclusos.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(243,236,222,0.75)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="2"><path d="M4 12l5 5L20 6"/></svg>
                {item}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(243,236,222,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>A partir de</p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cta-500)", lineHeight: 1 }}>
                R$ {preco.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <p style={{ fontSize: 12, color: "rgba(243,236,222,0.4)", maxWidth: 140, textAlign: "right" }}>Acesso imediato após pagamento</p>
          </div>

          <Link href={`/checkout?id=${data.id}`}>
            <button style={{
              width: "100%", padding: "18px 24px",
              background: "var(--cta-500)", color: "#fff",
              border: "none", borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 800,
              letterSpacing: "0.04em", cursor: "pointer",
              boxShadow: "var(--cta-glow)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              Liberar meu relatório completo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>
          </Link>
          <p style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "rgba(243,236,222,0.4)" }}>Pagamento seguro via Pix ou cartão</p>
        </div>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <Link href="/diagnostico" style={{ fontSize: 13, color: "rgba(243,236,222,0.4)" }}>
            Analisar outra atividade
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid rgba(243,236,222,0.1)", borderTop: "2px solid var(--gold-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ResultadoConteudo />
    </Suspense>
  );
}
