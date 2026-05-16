import Link from "next/link";
import Image from "next/image";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { FaqSection } from "@/components/landing/FaqSection";
import { LiveViewerWidget, RecentActivityToaster } from "@/components/landing/SocialProof";

/* ── Ícones ──────────────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>
);
const CheckIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 12l5 5L20 6"/></svg>
);

/* ── Logo ────────────────────────────────────────────────────────── */
function Logo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Image src="/assets/obraradar-mark-clean.png" alt="Obra Radar" width={Math.round(size * 1.4)} height={Math.round(size * 0.9)} style={{ display: "block", objectFit: "contain" }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span className="logo-title" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#f3ecde", letterSpacing: "0.03em", textTransform: "uppercase" }}>OBRA RADAR</span>
        <span className="logo-subtitle" style={{ fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700, color: "rgba(243,236,222,0.5)", letterSpacing: "0.26em", marginTop: 4, textTransform: "uppercase" }}>Diagnóstico · RUP</span>
      </div>
    </div>
  );
}

/* ── TopNav ──────────────────────────────────────────────────────── */
function TopNav() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 16 }}>
        <Link href="/" style={{ background: "none", border: 0, padding: 0, flexShrink: 0 }}>
          <Logo size={32} />
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["#metodo", "Método"], ["#como", "Como funciona"], ["#faq", "FAQ"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "#f3ecde", opacity: 0.8 }}>{label}</a>
          ))}
        </div>
        <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", background: "transparent", color: "var(--gold-500)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)", whiteSpace: "nowrap", flexShrink: 0 }}>
          <span className="nav-cta-text">Calcular grátis</span>
          <span className="nav-cta-icon" style={{ display: "none" }}>Calcular</span>
          <ArrowRight />
        </Link>
      </div>
    </nav>
  );
}

/* ── Hero ─ centrado, fórmula como elemento visual principal ─────── */
function HeroLanding() {
  return (
    <section style={{ background: "var(--navy-900)", paddingTop: 96, paddingBottom: 88, position: "relative", overflow: "hidden" }}>
      {/* Padrão diagonal de fundo */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(201,165,116,0.03) 0px, rgba(201,165,116,0.03) 1px, transparent 1px, transparent 56px)", pointerEvents: "none" }} />

      <div className="container-x" style={{ position: "relative", textAlign: "center" }}>
        {/* Badge pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(201,165,116,0.08)", border: "1px solid rgba(201,165,116,0.22)", borderRadius: 100, marginBottom: 36 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 7px #10b981" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--gold-500)", fontWeight: 700, textTransform: "uppercase" }}>Diagnóstico de produtividade · Método RUP</span>
        </div>

        <h1 className="display display-xb" style={{ fontSize: "clamp(36px, 6.5vw, 86px)", lineHeight: 0.95, color: "#f3ecde", maxWidth: 920, margin: "0 auto" }}>
          Descubra se sua equipe{" "}
          <span style={{ color: "var(--gold-500)" }}>está gerando perda</span>{" "}
          na obra
        </h1>

        {/* Fórmula RUP como bloco visual central */}
        <div style={{ margin: "52px auto 0", maxWidth: 440, padding: "0 16px" }}>
          <div className="display" style={{ fontSize: "clamp(16px, 3.5vw, 30px)", color: "rgba(243,236,222,0.9)", letterSpacing: "0.05em" }}>
            CUSTO EQUIPE/DIA
          </div>
          {/* Linha de fração + label RUP — inline para não vazar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "14px 0" }}>
            <div style={{ flex: 1, maxWidth: 280, height: 2, background: "var(--gold-500)" }} />
            <span className="display" style={{ fontSize: "clamp(26px, 4vw, 44px)", color: "var(--gold-500)", lineHeight: 1, flexShrink: 0 }}>RUP</span>
          </div>
          <div className="display" style={{ fontSize: "clamp(16px, 3.5vw, 30px)", color: "rgba(243,236,222,0.9)", letterSpacing: "0.05em" }}>
            QTD. EXECUTADA
          </div>
          <div style={{ marginTop: 14, fontSize: 11, letterSpacing: "0.2em", color: "rgba(243,236,222,0.35)", textTransform: "uppercase", fontWeight: 600 }}>
            Razão Unitária de Produção
          </div>
        </div>

        <p style={{ marginTop: 40, fontSize: 16, lineHeight: 1.68, color: "rgba(243,236,222,0.65)", maxWidth: 460, margin: "40px auto 0" }}>
          Informe os dados da sua frente de serviço e receba o diagnóstico de RUP, grátis, em menos de 3 minutos.
        </p>

        <div style={{ marginTop: 36 }}>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 32px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular minha RUP em 3 min <ArrowRight />
          </Link>
        </div>

        <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", color: "rgba(243,236,222,0.5)", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />100% grátis</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Sem cadastro</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Resultado imediato</span>
        </div>
      </div>
    </section>
  );
}

/* ── Método RUP ─ barra horizontal de severidade ─────────────────── */
function MetodoRUPSection() {
  const sevs: [string, string, string][] = [
    ["VERIFICAR", "< −10%", "var(--sev-verificar)"],
    ["NORMAL", "±10%", "var(--sev-normal)"],
    ["ATENÇÃO", "+20%", "var(--sev-atencao)"],
    ["ALERTA", "+30%", "var(--sev-alerta)"],
    ["CRÍTICO", ">+30%", "var(--sev-critico)"],
  ];

  return (
    <section className="section" id="metodo" style={{ background: "var(--cream-100)", color: "var(--ink-900)", borderTop: "1px solid rgba(11,18,38,0.08)" }}>
      <div className="container-x">

        {/* Cabeçalho centrado */}
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", marginBottom: 56 }}>
          <span className="t-label t-label-on-cream">O Método por Trás do Diagnóstico</span>
          <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 58px)", margin: "18px 0 0", color: "var(--ink-900)" }}>
            O QUE É <span style={{ color: "var(--gold-600)" }}>RUP</span>?
          </h2>
          <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.75, color: "var(--ink-500)" }}>
            A <strong style={{ color: "var(--ink-900)" }}>Razão Unitária de Produção</strong> é o indicador que mede quantas horas‑homem foram necessárias para executar uma unidade de serviço. Quanto menor a RUP, mais produtiva a equipe. Comparada ao benchmark normativo, ela revela desvios que custam caro e que raramente aparecem nos relatórios de avanço físico.
          </p>
        </div>

        {/* Barra horizontal de severidade */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "var(--ink-500)", marginBottom: 16, textAlign: "center" }}>Escala de severidade do desvio</div>
          <div className="sev-bar-grid">
            {sevs.map(([sev, range, color]) => (
              <div key={sev} className="sev-bar-item" style={{ background: color }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(10px, 1.8vw, 13px)", fontWeight: 700, letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>{sev}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(10px, 1.6vw, 12px)", color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fórmulas em 2 cards lado a lado */}
        <div className="metodo-formula-grid">
          <div style={{ padding: "24px 28px", background: "rgba(11,18,38,0.06)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--gold-600)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "var(--gold-600)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>HH Total</div>
            <div className="formula-text" style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-900)", wordBreak: "break-word" }}>Trabalhadores × Horas/dia × Dias</div>
          </div>
          <div style={{ padding: "24px 28px", background: "rgba(11,18,38,0.06)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--ink-700)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "var(--ink-700)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Desvio (%)</div>
            <div className="formula-text" style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink-900)", wordBreak: "break-word" }}>(RUP real − RUP ref) ÷ RUP ref × 100</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "var(--ink-900)", color: "#f3ecde", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular minha RUP <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Como Funciona ─ etapas numeradas verticais ──────────────────── */
function ComoFuncionaSection() {
  const steps = [
    { num: "01", title: "Quiz rápido", body: "6 perguntas guiadas sobre a obra, equipe e serviço executado. Sem cadastro." },
    { num: "02", title: "Cálculo instantâneo", body: "Motor compara sua RUP real com o benchmark normativo e retorna o desvio e a severidade." },
    { num: "03", title: "Laudo técnico", body: "Prévia grátis imediata. Relatório completo com causas e ações recomendadas por R$ 39,90." },
  ];

  return (
    <section className="section" id="como" style={{ background: "var(--navy-800)", borderTop: "1px solid var(--navy-line)" }}>
      <div className="container-x">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span className="t-label" style={{ marginBottom: 20 }}>Como funciona</span>
          <h2 className="display" style={{ fontSize: "clamp(30px, 4.5vw, 56px)", color: "#f3ecde", marginBottom: 64 }}>
            DO QUIZ AO LAUDO EM <span style={{ color: "var(--gold-500)" }}>3 PASSOS</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((step, i) => (
            <div key={step.num} className="step-row" style={{ borderTop: "1px solid var(--navy-line)", paddingTop: 36, paddingBottom: 36 }}>
              <div className="display" style={{ fontSize: "clamp(56px, 9vw, 96px)", color: "var(--cta-500)", lineHeight: 1, flexShrink: 0, minWidth: 120 }}>{step.num}</div>
              <div style={{ flex: 1 }}>
                <h3 className="display" style={{ fontSize: "clamp(22px, 3.5vw, 34px)", color: "#f3ecde", textTransform: "uppercase", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.6)", maxWidth: 560 }}>{step.body}</p>
              </div>
              <div style={{ flexShrink: 0, alignSelf: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--navy-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(243,236,222,0.3)" }}>
                  <span style={{ fontSize: 13 }}>{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--navy-line)", paddingTop: 40 }}>
            <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
              Iniciar meu diagnóstico <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer CTA ─ split: preço esquerda / CTA direita ───────────── */
function FooterCTA() {
  return (
    <section className="section" style={{ background: "var(--navy-900)", borderTop: "1px solid var(--navy-line)" }}>
      <div className="container-x">
        <div className="footer-cta-grid">
          {/* Bloco preço */}
          <div>
            <span className="t-label">Oferta de lançamento · Pagamento único</span>
            <h2 className="display display-xb" style={{ marginTop: 20, fontSize: "clamp(36px, 5.5vw, 72px)", color: "#f3ecde", lineHeight: 0.95 }}>
              AUDITE SUA OBRA POR MENOS DE{" "}
              <span style={{ color: "var(--gold-500)" }}>R$ 40</span>
            </h2>
            <p style={{ marginTop: 20, fontSize: 15, color: "rgba(243,236,222,0.55)", maxWidth: 420, lineHeight: 1.7 }}>
              O quiz é grátis. Você só paga se quiser desbloquear o laudo técnico completo.
            </p>
          </div>

          {/* Bloco CTA */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, paddingLeft: 0 }}>
            <div style={{ padding: "28px 32px", border: "1px solid rgba(201,165,116,0.2)", borderRadius: "var(--radius-lg)", background: "rgba(201,165,116,0.04)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--gold-500)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Quiz gratuito</div>
              <div className="display" style={{ fontSize: 28, color: "#f3ecde" }}>R$ 0,00</div>
              <div style={{ fontSize: 13, color: "rgba(243,236,222,0.5)", marginTop: 4 }}>Diagnóstico + prévia do relatório</div>
              <div style={{ marginTop: 20 }}>
                <Link href="/diagnostico" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, borderRadius: "var(--radius-md)", textDecoration: "none", boxShadow: "var(--cta-glow)" }}>
                  <span>Calcular minha RUP em 3 min</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Resultado imediato, sem cadastro", "Laudo técnico completo por R$ 39,90", "76 serviços de construção civil cobertos"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(243,236,222,0.6)" }}>
                  <CheckIcon size={14} /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer style={{ background: "#060b1c", borderTop: "1px solid var(--navy-line)", padding: "48px 0 32px" }}>
      <div className="container-x">
        <div className="footer-grid">
          <div>
            <Logo size={36} />
            <p style={{ marginTop: 16, color: "rgba(243,236,222,0.45)", fontSize: 14, maxWidth: 300, lineHeight: 1.65 }}>
              Diagnóstico técnico de produtividade de mão de obra para gestores de obra que exigem rigor.
            </p>
          </div>
          {[
            { title: "Produto", items: [["Diagnóstico", "/diagnostico"], ["Método RUP", "#metodo"], ["Relatório", "#como"], ["Preço", "#como"]] },
            { title: "Empresa", items: [["Sobre", "https://alcazarengenharia.com/"], ["Contato", "/contato"], ["Suporte", "/suporte"], ["Termos", "/termos"]] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.items.map(([label, href]) => (
                  <a key={label} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ fontSize: 14, color: "rgba(243,236,222,0.5)" }}>{label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid var(--navy-line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: "rgba(243,236,222,0.3)", fontSize: 12 }}>
          <span>© 2026 OBRA RADAR — Engenharia de Produtividade</span>
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>CNPJ 61.288.947/0001-34</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div>
      <TopNav />
      <HeroLanding />
      <MetodoRUPSection />
      <ComoFuncionaSection />
      <TestimonialsCarousel />
      <FaqSection />
      <FooterCTA />
      <SiteFooter />
      <LiveViewerWidget />
      <RecentActivityToaster />
    </div>
  );
}
