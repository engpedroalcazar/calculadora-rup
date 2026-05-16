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

/* ── Bracket corners ─────────────────────────────────────────────── */
function Brackets({ color = "#c9a574", size = 14, thickness = 1.2, inset = 10 }: { color?: string; size?: number; thickness?: number; inset?: number }) {
  const b = (pos: "tl" | "tr" | "bl" | "br") => {
    const style: React.CSSProperties = { position: "absolute", width: size, height: size, pointerEvents: "none" };
    if (pos === "tl") { style.top = inset; style.left = inset; style.borderTop = `${thickness}px solid ${color}`; style.borderLeft = `${thickness}px solid ${color}`; }
    if (pos === "tr") { style.top = inset; style.right = inset; style.borderTop = `${thickness}px solid ${color}`; style.borderRight = `${thickness}px solid ${color}`; }
    if (pos === "bl") { style.bottom = inset; style.left = inset; style.borderBottom = `${thickness}px solid ${color}`; style.borderLeft = `${thickness}px solid ${color}`; }
    if (pos === "br") { style.bottom = inset; style.right = inset; style.borderBottom = `${thickness}px solid ${color}`; style.borderRight = `${thickness}px solid ${color}`; }
    return <span key={pos} aria-hidden style={style} />;
  };
  return <>{b("tl")}{b("tr")}{b("bl")}{b("br")}</>;
}

/* ── Logo ────────────────────────────────────────────────────────── */
function Logo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Image src="/assets/obraradar-mark-clean.png" alt="Obra Radar" width={Math.round(size * 1.4)} height={Math.round(size * 0.9)} style={{ display: "block", objectFit: "contain" }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#f3ecde", letterSpacing: "0.03em", textTransform: "uppercase" }}>OBRA RADAR</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700, color: "rgba(243,236,222,0.5)", letterSpacing: "0.26em", marginTop: 4, textTransform: "uppercase" }}>Diagnóstico · RUP</span>
      </div>
    </div>
  );
}

/* ── TopNav ──────────────────────────────────────────────────────── */
function TopNav() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.88)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 16 }}>
        <Link href="/" style={{ background: "none", border: 0, padding: 0, flexShrink: 0 }}>
          <Logo size={32} />
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["#metodo", "Método"], ["#como", "Como funciona"], ["#faq", "FAQ"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "#f3ecde", opacity: 0.8 }}>{label}</a>
          ))}
        </div>
        <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", background: "var(--cta-500)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", whiteSpace: "nowrap", boxShadow: "var(--cta-glow)", flexShrink: 0 }}>
          Calcular grátis <ArrowRight />
        </Link>
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────── */
function HeroLanding() {
  return (
    <section className="vignette-navy grid-bg" style={{ position: "relative", overflow: "hidden", paddingTop: 64, paddingBottom: 80 }}>
      <div className="container-x">
        <div className="hero-grid">

          {/* Coluna esquerda */}
          <div style={{ paddingTop: 16 }}>
            <span className="t-label">DIAGNÓSTICO DE PRODUTIVIDADE · MÉTODO RUP</span>
            <h1 className="display display-xb" style={{ fontSize: "clamp(36px, 5.5vw, 80px)", margin: "24px 0 0", color: "#f3ecde", lineHeight: 1 }}>
              Descubra se sua equipe <span style={{ color: "var(--gold-500)" }}>está gerando perda</span> na obra.
            </h1>
            <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.65, color: "rgba(243,236,222,0.72)", maxWidth: 500 }}>
              Informe os dados da sua frente de serviço e receba o diagnóstico de RUP em menos de 3 minutos — grátis.
            </p>

            {/* Mini fórmula RUP inline */}
            <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", border: "1px solid rgba(201,165,116,0.35)", borderRadius: "var(--radius-md)", background: "rgba(201,165,116,0.07)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-500)", letterSpacing: "0.06em" }}>RUP</span>
              <span style={{ color: "rgba(243,236,222,0.4)", fontSize: 14 }}>= HH Total ÷ Qtd. Executada</span>
              <span style={{ fontSize: 11, color: "rgba(243,236,222,0.35)", borderLeft: "1px solid rgba(243,236,222,0.15)", paddingLeft: 10 }}>quanto menor, mais produtiva a equipe</span>
            </div>

            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 28px", background: "var(--cta-500)", color: "#fff", border: "none", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", cursor: "pointer", boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
                <span>Calcular minha RUP em 3 min</span>
                <ArrowRight />
              </Link>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 16, flexWrap: "wrap", color: "rgba(243,236,222,0.65)", fontSize: 13 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />100% grátis</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Sem cadastro</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Resultado imediato</span>
            </div>
          </div>

          {/* Coluna direita — card técnico */}
          <div className="hero-card-col">
            <div style={{ position: "relative", border: "1px solid rgba(243,236,222,0.15)", borderRadius: "var(--radius-sm)", padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 320 }}>
              <Brackets color="#c9a574" size={18} thickness={1.1} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--gold-500)", letterSpacing: "0.18em", textAlign: "right" }}>OR — 001 / 2026</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 16, paddingBottom: 16 }}>
                <Image src="/assets/obraradar-mark-clean.png" alt="Obra Radar" width={90} height={57} style={{ objectFit: "contain" }} />
                <span className="display" style={{ fontSize: 28, color: "#f3ecde" }}>OBRA RADAR</span>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(243,236,222,0.6)" }}>PRODUTIVIDADE · RUP</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(243,236,222,0.12)", paddingTop: 16 }}>
                {[["MÉTODO", "RUP"], ["ETAPAS", "06"], ["VERSÃO", "4.0"]].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 8, letterSpacing: "0.24em", fontWeight: 700, color: "rgba(243,236,222,0.45)", textTransform: "uppercase" }}>{label}</div>
                    <div className="display" style={{ fontSize: 20, color: "#f3ecde", marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Método RUP ──────────────────────────────────────────────────── */
function MetodoRUPSection() {
  const sevs: [string, string, string][] = [
    ["VERIFICAR", "Desvio < −10% · equipe acima da média", "var(--sev-verificar)"],
    ["NORMAL", "Desvio de −10% a +10%", "var(--sev-normal)"],
    ["ATENÇÃO", "Desvio de +10% a +20%", "var(--sev-atencao)"],
    ["ALERTA", "Desvio de +20% a +30%", "var(--sev-alerta)"],
    ["CRÍTICO", "Desvio acima de +30%", "var(--sev-critico)"],
  ];

  return (
    <section className="section vignette-navy grid-bg-tight" id="metodo" style={{ borderTop: "1px solid var(--navy-line)" }}>
      <div className="container-x">
        <div className="metodo-grid">
          <div>
            <span className="t-label">O MÉTODO POR TRÁS DO DIAGNÓSTICO</span>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4.2vw, 56px)", margin: "18px 0 0", color: "#f3ecde" }}>
              O QUE É <span style={{ color: "var(--gold-500)" }}>RUP</span>?
            </h2>
            <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.72)" }}>
              A <strong style={{ color: "#f3ecde" }}>Razão Unitária de Produção</strong> é o indicador que mede quantas horas‑homem foram necessárias para executar uma unidade de serviço. Quanto menor a RUP, mais produtiva a equipe.
            </p>
            <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.65)" }}>
              Comparada ao benchmark normativo do tipo de serviço, ela revela desvios que custam caro — e que raramente aparecem nos relatórios de avanço físico.
            </p>
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 480 }}>
              {sevs.map(([sev, range, color]) => (
                <div key={sev} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", border: "1px solid var(--navy-line)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ width: 8, height: 8, minWidth: 8, background: color, borderRadius: "50%", marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#f3ecde", textTransform: "uppercase" }}>{sev}</div>
                    <div style={{ fontSize: 11, color: "rgba(243,236,222,0.5)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{range}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card fórmula */}
          <div style={{ position: "relative", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "var(--radius-sm)", padding: 32 }}>
            <Brackets color="#c9a574" size={14} thickness={1} />
            <div className="counter">FÓRMULA</div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
              <div className="display" style={{ fontSize: 36, color: "var(--gold-500)" }}>RUP</div>
              <div style={{ width: 50, height: 1, background: "rgba(243,236,222,0.35)" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span className="display" style={{ fontSize: 18, color: "#f3ecde" }}>HH TOTAL</span>
                <span style={{ width: 190, height: 1, background: "rgba(243,236,222,0.55)" }} />
                <span className="display" style={{ fontSize: 18, color: "#f3ecde" }}>QTD. EXECUTADA</span>
              </div>
            </div>
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(243,236,222,0.1)", display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div>
                <div className="counter">HH TOTAL</div>
                <div style={{ fontSize: 13, marginTop: 6, color: "rgba(243,236,222,0.7)", lineHeight: 1.6 }}>Trabalhadores × Horas/dia × Dias</div>
              </div>
              <div>
                <div className="counter">DESVIO (%)</div>
                <div style={{ fontSize: 13, marginTop: 6, color: "rgba(243,236,222,0.7)", lineHeight: 1.6 }}>(RUP real − RUP ref) ÷ RUP ref × 100</div>
              </div>
            </div>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "var(--cta-500)", color: "#fff", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "var(--cta-glow)" }}>
                Calcular grátis <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Como Funciona ───────────────────────────────────────────────── */
function ComoFuncionaSection() {
  const steps = [
    { num: "01", title: "Quiz rápido", body: "6 perguntas guiadas sobre a obra, equipe e serviço executado. Sem cadastro." },
    { num: "02", title: "Cálculo instantâneo", body: "Motor compara sua RUP real com o benchmark normativo e retorna o desvio e a severidade." },
    { num: "03", title: "Laudo técnico", body: "Prévia grátis imediata. Relatório completo com causas e ações recomendadas por R$ 39,90." },
  ];

  return (
    <section style={{ background: "var(--cream-100)", color: "var(--ink-900)" }} className="section grid-bg-cream" id="como">
      <div className="container-x">
        <div style={{ marginBottom: 48 }}>
          <span className="t-label t-label-on-cream">COMO FUNCIONA</span>
          <h2 className="display" style={{ fontSize: "clamp(30px, 4vw, 52px)", margin: "16px 0 0", color: "var(--ink-900)" }}>
            DO QUIZ AO LAUDO EM <span style={{ color: "var(--gold-600)" }}>3 PASSOS</span>.
          </h2>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.num} style={{ position: "relative", padding: 28, border: "1px solid rgba(11,18,38,0.14)", background: "rgba(255,255,255,0.5)", borderRadius: "var(--radius-md)" }}>
              <Brackets color="#0b1226" size={12} thickness={1} />
              <div className="display" style={{ fontSize: 52, color: "var(--gold-600)", lineHeight: 1 }}>{step.num}</div>
              <h3 className="display" style={{ marginTop: 18, fontSize: 20, color: "var(--ink-900)", textTransform: "uppercase" }}>{step.title}</h3>
              <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.65, color: "var(--ink-500)", margin: "10px 0 0" }}>{step.body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", background: "var(--ink-900)", color: "#f3ecde", borderRadius: "var(--radius-md)" }}>
            Iniciar meu diagnóstico <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer CTA ──────────────────────────────────────────────────── */
function FooterCTA() {
  return (
    <section className="section vignette-navy grid-bg" style={{ textAlign: "center" }}>
      <div className="container-x" style={{ maxWidth: 800, margin: "0 auto" }}>
        <span className="t-label" style={{ justifyContent: "center" }}>OFERTA DE LANÇAMENTO · PAGAMENTO ÚNICO</span>
        <h2 className="display display-xb" style={{ marginTop: 20, fontSize: "clamp(36px, 5vw, 68px)", color: "#f3ecde", lineHeight: 1 }}>
          AUDITE SUA OBRA POR<br />MENOS DE <span style={{ color: "var(--gold-500)" }}>R$ 40</span>.
        </h2>
        <p style={{ marginTop: 20, fontSize: 16, color: "rgba(243,236,222,0.65)", maxWidth: 480, margin: "20px auto 0" }}>
          O quiz é grátis. Você só paga se quiser desbloquear o laudo técnico completo.
        </p>
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 28px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular minha RUP em 3 min <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer style={{ background: "var(--navy-900)", borderTop: "1px solid var(--navy-line)", padding: "48px 0 32px" }}>
      <div className="container-x">
        <div className="footer-grid">
          <div>
            <Logo size={36} />
            <p style={{ marginTop: 16, color: "rgba(243,236,222,0.55)", fontSize: 14, maxWidth: 300, lineHeight: 1.65 }}>
              Diagnóstico técnico de produtividade de mão de obra para gestores de obra que exigem rigor.
            </p>
          </div>
          {[
            { title: "Produto", links: ["Diagnóstico", "Método RUP", "Relatório", "Preço"] },
            { title: "Empresa", links: ["Sobre", "Contato", "Suporte", "Termos"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => <a key={l} href="#" style={{ fontSize: 14, color: "rgba(243,236,222,0.65)" }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid var(--navy-line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: "rgba(243,236,222,0.4)", fontSize: 12 }}>
          <span>© 2026 OBRA RADAR — Engenharia de Produtividade</span>
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>CNPJ 00.000.000/0001-00</span>
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
