"use client";
import { useState } from "react";

const FAQS = [
  ["O quiz é gratuito, mas e o resultado?", "O quiz não tem custo. Ao finalizar, você recebe uma prévia com o nível de severidade da obra. Para acessar o laudo técnico completo — RUP calculada, desvio percentual em relação ao benchmark, diagnóstico por fator de influência, causas prováveis e recomendações de ação — o valor é R$ 39,90, pagamento único, sem assinatura. É o custo de aproximadamente uma hora de consultoria técnica, com o detalhamento de um relatório completo de produtividade."],
  ["De onde vem o benchmark de produtividade?", "Os valores de referência partem de benchmarks consolidados na literatura técnica brasileira: TCPO, normativas ABNT e SINAPI. Além disso, a plataforma incorpora dados reais de campo, coletados de obras analisadas e anonimizados por tipo de serviço e categoria de obra. As referências refletem produtividade observada em canteiros reais, não apenas tabelas publicadas."],
  ["Posso usar o relatório como subsídio técnico?", "O laudo é um documento técnico de diagnóstico de produtividade, não substitui laudo pericial com ART. É adequado como subsídio em reuniões de obra, revisões de cronograma, justificativas de aditivo e tomadas de decisão de gestão — foi desenvolvido com essa finalidade."],
  ["Quanto tempo leva o diagnóstico completo?", "Em média, 3 a 5 minutos para responder o quiz. O cálculo da RUP e a geração do laudo são imediatos após a confirmação. O relatório fica disponível online para acesso a qualquer momento."],
  ["Os dados da minha obra ficam seguros?", "Sim. Todos os dados são criptografados em trânsito e em repouso. Não compartilhamos informações identificáveis de obras ou empresas com terceiros. Apenas indicadores agregados e anonimizados alimentam o benchmark da plataforma, em conformidade com a LGPD."],
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
              O QUE SE PERGUNTA <span style={{ color: "var(--gold-500)" }}>ANTES DE COMEÇAR</span>
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
