"use client";
import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  { name: "Pedro Henrique Alcazar", role: "Engenheiro Civil e de Segurança do Trabalho", company: "Alcazar Engenharia · Itu/SP", initials: "PA", quote: "Uso o Obra Radar antes de aceitar qualquer contrato de obra maior. Em poucos minutos tenho clareza sobre a capacidade produtiva da equipe disponível e se o cronograma proposto é viável.", metric: "−18% em HH na frente revisada", serviceTag: "Engenharia diagnóstica" },
  { name: "Camila Tavares", role: "Gerente de Planejamento", company: "Construtora Vértice · Curitiba/PR", initials: "CT", quote: "Levei o laudo para a reunião de diretoria e usamos como base do replanejamento. O documento já trazia os indicadores com referência normativa, o que facilitou muito a aprovação da revisão de cronograma.", metric: "Replanejou 4 frentes em 2 semanas", serviceTag: "Residencial vertical" },
  { name: "Mestre Joelson Ramos", role: "Mestre de Obras há 22 anos", company: "Obra particular · Goiânia/GO", initials: "JR", quote: "Fui cético no início. Mas o relatório confirmou o que eu já observava no canteiro: o tempo perdido no transporte de material estava distorcendo a produção da frente de alvenaria.", metric: "Reorganizou logística da frente", serviceTag: "Alvenaria estrutural" },
  { name: "Renata Coelho Andrade", role: "Coordenadora de Produção", company: "Pilar Engenharia · Recife/PE", initials: "RC", quote: "Antes levávamos três dias para fechar o controle de RUP de uma frente por mês. Com a plataforma, o levantamento sai no mesmo dia. Mudou o ritmo das nossas reuniões semanais de produção.", metric: "Economia de 3 dias/fechamento", serviceTag: "Industrial" },
  { name: "Eng. Rogério Alencar", role: "Diretor Técnico", company: "Alencar Engenharia · Belo Horizonte/MG", initials: "RA", quote: "Comprei o laudo sem muita expectativa, mas o detalhamento por fator — equipe, sequenciamento, ferramentas, supervisão — me deu argumento técnico para intervir em uma frente com desvio expressivo de produtividade.", metric: "R$ 92mil/mês de economia", serviceTag: "Infraestrutura" },
  { name: "Fernando Bittencourt", role: "Engenheiro de Obra", company: "Construtora Bittencourt · Porto Alegre/RS", initials: "FB", quote: "Sou cético com plataformas digitais em geral. Mas a relação entre o custo do laudo e o nível de detalhamento entregue é difícil de questionar. Já usei em seis frentes distintas nos últimos meses.", metric: "6 laudos em 4 meses", serviceTag: "Comercial" },
  { name: "Aline Furtado", role: "Engenheira de Segurança", company: "Furtado & Associados · Florianópolis/SC", initials: "AF", quote: "Uso para cruzar com o PCMAT. Quando a RUP está fora de faixa, frequentemente há horas extras não formalizadas, o que gera exposição em fiscalizações do MTE. Já identifiquei duas situações assim antes de virarem problema.", metric: "Identificou risco trabalhista", serviceTag: "Segurança do trabalho" },
  { name: "Daniel Prado", role: "Sócio-Gestor", company: "D. Prado Construtora · Salvador/BA", initials: "DP", quote: "Não esperava que fosse tão objetivo. Respondi as seis perguntas, identifiquei severidade crítica na fundação e tomei a decisão de redistribuir a equipe ainda naquela semana.", metric: "Recuperou 11 dias de cronograma", serviceTag: "Residencial horizontal" },
  { name: "Mariana de Souza Lima", role: "Coordenadora de Obras", company: "Lima Engenharia · Brasília/DF", initials: "ML", quote: "Em obra pública, cada hora-homem é auditável. Um laudo baseado em benchmarks normativos complementa o controle interno e oferece respaldo técnico adicional para as decisões de produção.", metric: "Adotado como padrão interno", serviceTag: "Obra pública" },
];

function ArrowBtn({ onClick, dir }: { onClick: () => void; dir: "left" | "right" }) {
  return (
    <button
      onClick={onClick}
      style={{ width: 48, height: 48, background: "transparent", border: "1px solid rgba(243,236,222,0.35)", borderRadius: "var(--radius-md)", color: "#f3ecde", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 160ms ease", flexShrink: 0 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-500)"; e.currentTarget.style.borderColor = "var(--gold-500)"; e.currentTarget.style.color = "#0b1226"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(243,236,222,0.35)"; e.currentTarget.style.color = "#f3ecde"; }}
      aria-label={dir === "left" ? "Anterior" : "Próximo"}
    >
      {dir === "left"
        ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 12H5"/><path d="M11 5l-7 7 7 7"/></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>}
    </button>
  );
}

export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 7000);
    return () => clearInterval(t);
  }, [paused, total]);

  const go = (dir: number) => { setIdx((i) => (i + dir + total) % total); setPaused(true); };

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const t = TESTIMONIALS[idx];

  return (
    <section className="section" style={{ background: "var(--navy-900)", overflow: "hidden", position: "relative" }} id="cases">
      <div className="container-x">
        {/* Header — responsivo via classe CSS */}
        <div className="testimonials-header" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end", marginBottom: 48 }}>
          <div>
            <span className="t-label">QUEM JÁ ANALISOU SUA OBRA AQUI</span>
            <h2 className="display display-xb" style={{ marginTop: 18, fontSize: "clamp(28px, 4.6vw, 60px)", color: "#f3ecde", maxWidth: 920 }}>
              ENGENHEIROS, MESTRES DE OBRA E COORDENADORES QUE PASSARAM A GERIR COM{" "}
              <span style={{ color: "var(--gold-500)" }}>DADOS REAIS DE PRODUTIVIDADE</span>
            </h2>
          </div>
          <div className="testimonials-controls" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-500)", letterSpacing: "0.2em" }}>
              {String(idx + 1).padStart(2, "0")} <span style={{ color: "rgba(243,236,222,0.45)" }}>/ {String(total).padStart(2, "0")}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <ArrowBtn onClick={() => go(-1)} dir="left" />
              <ArrowBtn onClick={() => go(1)} dir="right" />
            </div>
          </div>
        </div>

        {/* Card — swipe no mobile */}
        <div
          className="testimonials-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ position: "relative", padding: "56px 64px", border: "1px solid var(--navy-line-strong)", background: "linear-gradient(135deg, rgba(201,165,116,0.04), rgba(255,255,255,0.01))", minHeight: 360, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 56, alignItems: "center" }}
        >
          {/* bracket corners */}
          <span aria-hidden style={{ position: "absolute", width: 22, height: 22, top: 10, left: 10, borderTop: "1.2px solid #c9a574", borderLeft: "1.2px solid #c9a574", pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", width: 22, height: 22, top: 10, right: 10, borderTop: "1.2px solid #c9a574", borderRight: "1.2px solid #c9a574", pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", width: 22, height: 22, bottom: 10, left: 10, borderBottom: "1.2px solid #c9a574", borderLeft: "1.2px solid #c9a574", pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", width: 22, height: 22, bottom: 10, right: 10, borderBottom: "1.2px solid #c9a574", borderRight: "1.2px solid #c9a574", pointerEvents: "none" }} />

          <div className="testimonials-avatar" style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(201,165,116,0.1)", border: "1px solid var(--gold-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-500)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "0.02em" }}>{t.initials}</div>

          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 80, color: "var(--gold-500)", lineHeight: 0.6, marginBottom: 8 }}>"</div>
            <p style={{ fontSize: "clamp(16px, 2vw, 26px)", lineHeight: 1.45, color: "#f3ecde", fontWeight: 400, margin: 0 }}>{t.quote}</p>
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div className="display" style={{ fontSize: 18, color: "#f3ecde" }}>{t.name}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: "rgba(243,236,222,0.6)" }}>{t.role} · <span style={{ color: "rgba(243,236,222,0.85)" }}>{t.company}</span></div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)", color: "var(--gold-500)" }}>{t.serviceTag}</span>
            </div>
          </div>

          <div className="testimonials-metric" style={{ padding: "24px 28px", border: "1px solid var(--gold-500)", borderRadius: "var(--radius-md)", background: "rgba(201,165,116,0.08)", minWidth: 200, textAlign: "right" }}>
            <div className="counter">RESULTADO</div>
            <div className="display" style={{ marginTop: 10, fontSize: 22, color: "var(--gold-500)", lineHeight: 1.1 }}>{t.metric}</div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setPaused(true); }} style={{ width: i === idx ? 36 : 10, height: 4, background: i === idx ? "var(--gold-500)" : "rgba(243,236,222,0.2)", border: 0, padding: 0, cursor: "pointer", transition: "all 280ms ease" }} aria-label={`Depoimento ${i + 1}`} />
          ))}
        </div>

        {/* Stats — responsivo via classe CSS */}
        <div className="testimonials-stats" style={{ marginTop: 64, padding: "40px 0", borderTop: "1px solid var(--navy-line)", borderBottom: "1px solid var(--navy-line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[["2.840+", "Diagnósticos rodados"], ["76", "Atividades suportadas"], ["R$ 4.1M", "Em desvios detectados"], ["4,8", "Avaliação média (NPS)"]].map(([v, l]) => (
            <div key={l}>
              <div className="display display-xb" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "var(--cta-500)", lineHeight: 1 }}>{v}</div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(243,236,222,0.65)", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
