"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { corSeveridade, fmt } from "@/lib/rup";
import type { Severidade } from "@/lib/rup";

interface ResultadoData {
  id: string; severidade: Severidade; desvio: number;
  rupReal: number; rupRef: number; hhTotal: number;
  atividadeNome: string; unidade: string;
}

function mensagemPrincipal(s: Severidade, desvio: number): { titulo: string; corpo: string } {
  if (s === "NORMAL") return { titulo: "Produtividade dentro do esperado.", corpo: "Sua equipe está alinhada com a referência do setor." };
  if (s === "VERIFICAR") return { titulo: "Produtividade acima da referência.", corpo: "Verifique a medição — equipe excepcionalmente produtiva ou erro de lançamento." };
  const pct = Math.abs(desvio).toFixed(0);
  if (s === "ATENÇÃO") return { titulo: "Atenção: desvio moderado detectado.", corpo: `${pct}% acima da referência. Acompanhe por mais dias antes de agir.` };
  if (s === "ALERTA") return { titulo: "Alerta: equipe abaixo do esperado.", corpo: `Desvio de ${pct}% acima da referência. Avalie causas imediatamente.` };
  return { titulo: "Crítico: perda grave de produtividade.", corpo: `Desvio de ${pct}% acima da referência. Risco real de estouro de custo.` };
}

const sevColor: Record<Severidade, string> = {
  VERIFICAR: "#6b8fb5", NORMAL: "#74a87a", ATENÇÃO: "#d4a04a", ALERTA: "#d97c4a", CRÍTICO: "#c95a4a",
};

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

  const cor = corSeveridade(data.severidade);
  const msg = mensagemPrincipal(data.severidade, data.desvio);
  const sevBg = sevColor[data.severidade];
  const mostrarAlerta = data.severidade !== "NORMAL" && data.severidade !== "VERIFICAR";
  void cor;

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/assets/obraradar-mark-clean.png" alt="ObraRadar" width={48} height={30} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>OBRA RADAR</span>
          </Link>
          <span style={{ fontSize: 12, color: "rgba(243,236,222,0.5)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Diagnóstico concluído</span>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Badge severidade */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{
            display: "inline-block",
            background: sevBg,
            color: "#fff",
            padding: "8px 28px",
            borderRadius: 40,
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}>{data.severidade}</span>
        </div>

        {/* Mensagem */}
        <div style={{
          marginBottom: 20,
          padding: 20,
          background: mostrarAlerta ? "rgba(217,124,74,0.1)" : "rgba(116,168,122,0.1)",
          border: `1px solid ${mostrarAlerta ? "rgba(217,124,74,0.35)" : "rgba(116,168,122,0.35)"}`,
          borderRadius: "var(--radius-md)",
        }}>
          <p style={{ fontWeight: 800, fontSize: 16, margin: "0 0 6px", color: "#f3ecde" }}>{msg.titulo}</p>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(243,236,222,0.75)", margin: 0 }}>{msg.corpo}</p>
        </div>

        {/* Atividade */}
        <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(243,236,222,0.04)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold-500)" }}>Atividade analisada</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#f3ecde" }}>{data.atividadeNome}</p>
        </div>

        {/* Resultado parcial */}
        <div style={{ marginBottom: 24, padding: 20, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#f3ecde" }}>Resultado da análise</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(243,236,222,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Relatório completo bloqueado
            </div>
          </div>

          {/* Desvio — visível */}
          <div style={{ padding: 18, background: "rgba(243,236,222,0.05)", borderRadius: "var(--radius-md)", marginBottom: 12 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(243,236,222,0.55)" }}>Desvio em relação à referência</p>
            <p style={{ margin: 0, fontSize: 40, fontFamily: "var(--font-display)", color: data.desvio > 0 ? "#c95a4a" : "#74a87a", lineHeight: 1 }}>
              {data.desvio > 0 ? "+" : ""}{fmt(data.desvio, 1)}%
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(243,236,222,0.45)" }}>
              RUP real: {fmt(data.rupReal)} Hh/{data.unidade} · Referência: {fmt(data.rupRef)} Hh/{data.unidade}
            </p>
          </div>

          {/* Métricas bloqueadas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {["HH total", "Custo estimado", "Perda estimada"].map((label) => (
              <div key={label} style={{ position: "relative", padding: 16, background: "rgba(243,236,222,0.03)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(243,236,222,0.4)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</p>
                <p style={{ margin: 0, fontSize: 22, fontFamily: "var(--font-display)", color: "rgba(243,236,222,0.15)", filter: "blur(5px)", userSelect: "none" }}>000,00</p>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(243,236,222,0.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: 28, background: "rgba(201,165,116,0.08)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 18, color: "#f3ecde", letterSpacing: "0.03em" }}>RELATÓRIO COMPLETO</p>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(243,236,222,0.7)", marginBottom: 16 }}>
            Libere HH total, custo estimado, perda em reais, causas mais prováveis e ações recomendadas.
          </p>
          <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
            {["RUP real e referência detalhadas", "HH total e custo estimado", "Perda estimada em reais", "Diagnóstico automático completo", "Causas mais prováveis", "Ações recomendadas"].map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(243,236,222,0.8)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="2"><path d="M4 12l5 5L20 6"/></svg>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(243,236,222,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Valor do relatório</p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cta-500)", lineHeight: 1 }}>
                R$ {Number(process.env.NEXT_PUBLIC_PRECO ?? 39.9).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <p style={{ fontSize: 12, color: "rgba(243,236,222,0.4)", maxWidth: 130, textAlign: "right" }}>Acesso imediato após pagamento</p>
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
          <Link href="/diagnostico" style={{ fontSize: 13, color: "rgba(243,236,222,0.45)" }}>
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
