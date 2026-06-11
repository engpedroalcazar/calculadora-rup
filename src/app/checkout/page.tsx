"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/assets/obraradar-mark-clean.png" alt="ObraRadar" width={48} height={30} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>OBRA RADAR</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(243,236,222,0.6)", fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Pagamento seguro
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 32px)", color: "#f3ecde", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          Escolha seu plano
        </h1>
        <p style={{ fontSize: 15, color: "rgba(243,236,222,0.55)", margin: "0 0 32px" }}>
          Selecione a opção que melhor se encaixa na sua necessidade.
        </p>

        {/* Seleção de planos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
          {PLANOS.map((p) => {
            const selecionado = plano === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlano(p.id)}
                style={{
                  position: "relative",
                  padding: 24,
                  background: selecionado ? "rgba(201,165,116,0.1)" : "rgba(243,236,222,0.03)",
                  border: selecionado ? "2px solid var(--gold-500)" : "2px solid rgba(243,236,222,0.1)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                {/* Badge destaque */}
                {p.destaque && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--cta-500)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 100, whiteSpace: "nowrap" }}>
                    Melhor custo-benefício
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: selecionado ? "var(--gold-500)" : "#f3ecde", letterSpacing: "0.04em" }}>{p.nome}</div>
                    <div style={{ fontSize: 13, color: "rgba(243,236,222,0.55)", marginTop: 2 }}>{p.descricao}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selecionado ? "var(--gold-500)" : "rgba(243,236,222,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selecionado && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold-500)" }} />}
                  </div>
                </div>

                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: selecionado ? "#f3ecde" : "rgba(243,236,222,0.7)", lineHeight: 1, marginBottom: 4 }}>
                  R$ {p.preco.toFixed(2).replace(".", ",")}
                </div>
                {"economia" in p && (
                  <div style={{ fontSize: 11, color: "var(--cta-500)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 16 }}>{p.economia}</div>
                )}
                {!("economia" in p) && <div style={{ marginBottom: 16 }} />}

                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
                  {p.itens.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: selecionado ? "rgba(243,236,222,0.8)" : "rgba(243,236,222,0.5)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selecionado ? "var(--cta-500)" : "rgba(243,236,222,0.3)"} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M4 12l5 5L20 6"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* O que está incluso */}
        <div style={{ marginBottom: 20, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
          <p style={{ margin: "0 0 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)" }}>O que você recebe em cada relatório</p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {inclusos.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(243,236,222,0.75)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cta-500)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M4 12l5 5L20 6"/></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Resumo */}
        <div style={{ marginBottom: 20, padding: 24, background: "rgba(201,165,116,0.06)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(243,236,222,0.08)" }}>
            <span style={{ fontSize: 14, color: "rgba(243,236,222,0.7)" }}>{planoSelecionado.nome} — {planoSelecionado.descricao}</span>
            <span style={{ fontWeight: 700, color: "#f3ecde" }}>R$ {preco.toFixed(2).replace(".", ",")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#f3ecde", letterSpacing: "0.04em" }}>TOTAL</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--gold-500)", lineHeight: 1 }}>
              R$ {preco.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Forma de pagamento */}
        <div style={{ marginBottom: 24, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)" }}>Forma de pagamento</p>
          <div style={{ padding: "14px 18px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--cta-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cta-500)" }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#f3ecde" }}>Pix / Cartão de crédito</span>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(243,236,222,0.4)", textAlign: "center" }}>
            Pix e cartão de crédito via Mercado Pago
          </p>
        </div>

        {erro && (
          <div style={{ marginBottom: 16, padding: "14px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "var(--radius-md)", fontSize: 14, color: "#fca5a5" }}>
            {erro}
          </div>
        )}

        <button
          onClick={confirmar}
          disabled={loading || !id}
          style={{
            width: "100%", padding: "18px 24px",
            background: (loading || !id) ? "rgba(16,185,129,0.4)" : "var(--cta-500)",
            color: "#fff", border: "none", borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 800,
            letterSpacing: "0.04em", cursor: (loading || !id) ? "not-allowed" : "pointer",
            boxShadow: (loading || !id) ? "none" : "var(--cta-glow)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Processando...
            </>
          ) : `Confirmar — R$ ${preco.toFixed(2).replace(".", ",")}`}
        </button>

        <p style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "rgba(243,236,222,0.4)" }}>
          Acesso imediato ao relatório após confirmação.
        </p>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href={`/resultado?id=${id}`} style={{ fontSize: 13, color: "rgba(243,236,222,0.4)" }}>
            Voltar para o resultado
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid rgba(243,236,222,0.1)", borderTop: "2px solid var(--gold-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CheckoutConteudo />
    </Suspense>
  );
}
