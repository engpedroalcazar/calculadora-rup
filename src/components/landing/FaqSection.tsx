"use client";
import { useState } from "react";

const FAQS = [
  ["O diagnóstico é realmente gratuito?", "Sim. Você responde o quiz, recebe a prévia do diagnóstico com RUP calculada e severidade classificada — sem pagar nada. O relatório técnico completo, com recomendações detalhadas por serviço, é o produto pago (R$ 39,90)."],
  ["De onde vem o benchmark de produtividade?", "Os valores de referência são consolidados a partir de TCPO (Tabelas de Composições de Preços para Orçamentos), normativas da ABNT e dados anonimizados de obras analisadas pela plataforma — segmentadas por tipo de obra e serviço."],
  ["Posso usar o relatório como prova técnica?", "O relatório é um documento técnico de diagnóstico, não substitui laudo pericial assinado por engenheiro responsável. Pode (e deve) ser usado como subsídio em reuniões de obra, decisões de planejamento e revisão de cronograma."],
  ["Quanto tempo leva o diagnóstico completo?", "Em média, 5 a 7 minutos para responder o quiz. O cálculo da RUP e a geração do relatório são imediatos. O PDF chega no seu e-mail e fica disponível na plataforma."],
  ["Os meus dados de obra ficam seguros?", "Dados criptografados em trânsito e em repouso. Não compartilhamos dados identificáveis de obras com terceiros — apenas indicadores agregados, anonimizados, alimentam o benchmark."],
];

function FaqItem({ q, a, idx, defaultOpen }: { q: string; a: string; idx: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(11,18,38,0.2)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: 0, padding: "26px 0", textAlign: "left", color: "var(--ink-900)", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-600)" }}>{String(idx + 1).padStart(2, "0")}</span>
          <span className="display" style={{ fontSize: 22, color: "var(--ink-900)" }}>{q}</span>
        </div>
        <span style={{ color: "var(--gold-600)", flexShrink: 0, marginLeft: 16 }}>
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 26, paddingLeft: 52, paddingRight: 40, color: "var(--ink-500)", fontSize: 15, lineHeight: 1.65, maxWidth: 720 }}>{a}</div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }} id="faq">
      <div className="container-x">
        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "start" }}>
          <div>
            <span className="t-label t-label-on-cream">DÚVIDAS FREQUENTES</span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 60px)", margin: "20px 0 0", color: "var(--ink-900)", maxWidth: 420 }}>
              O QUE OS <span style={{ color: "var(--gold-500)" }}>ENGENHEIROS</span> PERGUNTAM ANTES DE COMEÇAR.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid rgba(11,18,38,0.2)" }}>
            {FAQS.map(([q, a], i) => <FaqItem key={i} q={q} a={a} idx={i} defaultOpen={i === 0} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
