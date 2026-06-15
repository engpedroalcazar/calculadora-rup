import Link from "next/link";
import Image from "next/image";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
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
        <span className="logo-subtitle" style={{ fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700, color: "rgba(243,236,222,0.5)", letterSpacing: "0.26em", marginTop: 4, textTransform: "uppercase" }}>Orçamento · Produtividade</span>
      </div>
    </div>
  );
}

/* ── TopNav ─ nav unificado da plataforma ────────────────────────── */
function TopNav() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 16 }}>
        <Link href="/" style={{ background: "none", border: 0, padding: 0, flexShrink: 0 }}>
          <Logo size={32} />
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["#produtos", "Produtos"], ["#cases", "Depoimentos"], ["#faq", "FAQ"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "#f3ecde", opacity: 0.8 }}>{label}</a>
          ))}
        </div>
        <a href="#produtos" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", background: "transparent", color: "var(--gold-500)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)", whiteSpace: "nowrap", flexShrink: 0 }}>
          <span className="nav-cta-text">Começar grátis</span>
          <span className="nav-cta-icon" style={{ display: "none" }}>Começar</span>
          <ArrowRight />
        </a>
      </div>
    </nav>
  );
}

/* ── Hero ─ vitrine: ORC na frente, copy de conversão ────────────── */
function HeroVitrine() {
  return (
    <section style={{ background: "var(--navy-900)", paddingTop: 96, paddingBottom: 88, position: "relative", overflow: "hidden" }}>
      {/* Padrão diagonal de fundo */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(201,165,116,0.03) 0px, rgba(201,165,116,0.03) 1px, transparent 1px, transparent 56px)", pointerEvents: "none" }} />

      <div className="container-x" style={{ position: "relative", textAlign: "center" }}>
        {/* Badge pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(201,165,116,0.08)", border: "1px solid rgba(201,165,116,0.22)", borderRadius: 100, marginBottom: 36 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 7px #10b981" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--gold-500)", fontWeight: 700, textTransform: "uppercase" }}>Plataforma técnica · Construção civil brasileira</span>
        </div>

        <h1 className="display display-xb" style={{ fontSize: "clamp(34px, 6vw, 80px)", lineHeight: 0.95, color: "#f3ecde", maxWidth: 900, margin: "0 auto" }}>
          Sua obra vai{" "}
          <span style={{ color: "var(--gold-500)" }}>estourar o orçamento</span>?
        </h1>

        <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.68, color: "rgba(243,236,222,0.65)", maxWidth: 580, margin: "28px auto 0" }}>
          79% dos grandes projetos estouram. Calcule o custo real da sua obra com base SINAPI 06/2026 — e meça se a equipe produz o que deveria. Grátis, em minutos.
        </p>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href="/orcamento/orcar" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 30px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular meu orçamento agora <ArrowRight />
          </Link>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 30px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular minha RUP <ArrowRight />
          </Link>
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", color: "rgba(243,236,222,0.5)", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Grátis pra começar</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Sem cadastro</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />76 serviços de obra cobertos</span>
        </div>
      </div>
    </section>
  );
}

/* ── Gancho ─ a pergunta da palestra + números do setor ──────────── */
function GanchoSection() {
  const stats: { numero: string; texto: string }[] = [
    { numero: "79%", texto: "dos grandes projetos estouram o orçamento — e atrasam, em média, metade do prazo" },
    { numero: "~1%/ano", texto: "de ganho de produtividade na construção em 20 anos — contra ~2,8% do resto da economia" },
    { numero: "5–9%", texto: "do custo total da obra é puro retrabalho — evitável com dado e processo" },
  ];

  return (
    <section className="section" style={{ background: "var(--cream-100)", color: "var(--ink-900)", borderTop: "1px solid rgba(11,18,38,0.08)" }}>
      <div className="container-x">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
          <span className="t-label t-label-on-cream">A pergunta que move tudo</span>
          <h2 className="display" style={{ fontSize: "clamp(26px, 3.8vw, 48px)", margin: "18px 0 0", color: "var(--ink-900)", lineHeight: 1.05 }}>
            E SE O PREJUÍZO QUE SÓ APARECE NO FECHAMENTO DA OBRA PUDESSE SER VISTO{" "}
            <span style={{ color: "var(--gold-600)" }}>ENQUANTO AINDA DÁ TEMPO DE AGIR</span>?
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.numero} style={{ padding: "28px 30px", background: "var(--white)", borderRadius: "var(--radius-md)", borderTop: "3px solid var(--gold-500)", boxShadow: "0 4px 16px -8px rgba(11,18,38,0.12)" }}>
              <div className="display display-xb" style={{ fontSize: "clamp(36px, 4.5vw, 52px)", color: "var(--ink-900)", lineHeight: 1 }}>{s.numero}</div>
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, color: "var(--ink-500)" }}>{s.texto}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--ink-400)", letterSpacing: "0.04em" }}>
          Fontes: McKinsey Global Institute · Construction Industry Institute / FMI
        </p>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 16, fontWeight: 700, color: "var(--ink-900)", maxWidth: 640, margin: "32px auto 0", lineHeight: 1.6 }}>
          O desperdício não vem de falta de esforço — vem de informação que já existe, mas não chega a tempo na decisão. As duas ferramentas abaixo colocam essa informação na sua mão <em>antes</em> do prejuízo.{" "}
          <a href="#produtos" style={{ color: "var(--gold-600)", textDecoration: "underline", textUnderlineOffset: 4 }}>Escolha a sua ↓</a>
        </p>
      </div>
    </section>
  );
}

/* ── Produtos ─ ORC puxa, RUP acompanha ──────────────────────────── */
function ProdutosSection() {
  return (
    <section className="section" id="produtos" style={{ background: "var(--navy-800)", borderTop: "1px solid var(--navy-line)" }}>
      <div className="container-x">
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", marginBottom: 56 }}>
          <span className="t-label no-rule">Os produtos</span>
          <h2 className="display display-xb" style={{ fontSize: "clamp(30px, 4.5vw, 56px)", margin: "18px 0 0", color: "#f3ecde" }}>
            ESCOLHA POR ONDE <span style={{ color: "var(--gold-500)" }}>COMEÇAR</span>
          </h2>
          <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.6)" }}>
            Os dois começam grátis e sem cadastro. Clique no que resolve a sua dor de hoje.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 980, margin: "0 auto" }}>
          {/* Card Orçamento — produto âncora */}
          <div style={{ display: "flex", flexDirection: "column", padding: "36px 34px", background: "var(--navy-900)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-lg)" }}>
            <span style={{ alignSelf: "flex-start", fontSize: 10, letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", color: "var(--gold-500)", padding: "5px 12px", border: "1px solid var(--gold-line)", borderRadius: 100 }}>Comece por aqui · Pra obra que vai começar</span>
            <h3 className="display" style={{ fontSize: "clamp(26px, 3vw, 34px)", color: "#f3ecde", marginTop: 22, marginBottom: 0 }}>CALCULADORA DE ORÇAMENTO</h3>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.6)" }}>
              Quanto sua obra vai custar de verdade: material, mão de obra com encargos, BDI e prazo — base SINAPI 06/2026 com fator regional por estado.
            </p>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {["76 atividades · 26 estados · 3 padrões de acabamento", "Orçamento multi-serviço com combos automáticos", "Custo final estimado grátis, em 5 etapas guiadas"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(243,236,222,0.75)" }}>
                  <span style={{ color: "var(--gold-500)", flexShrink: 0, marginTop: 2 }}><CheckIcon size={14} /></span> {item}
                </div>
              ))}
            </div>
            <Link href="/orcamento/orcar" style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, borderRadius: "var(--radius-md)", textDecoration: "none", boxShadow: "var(--cta-glow)" }}>
              <span>Calcular meu orçamento</span> <ArrowRight />
            </Link>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <Link href="/orcamento" style={{ fontSize: 12, color: "rgba(243,236,222,0.45)", textDecoration: "underline", textUnderlineOffset: 3 }}>ou conheça a ferramenta antes</Link>
            </div>
          </div>

          {/* Card RUP */}
          <div style={{ display: "flex", flexDirection: "column", padding: "36px 34px", background: "var(--navy-900)", border: "1px solid var(--navy-line-strong)", borderRadius: "var(--radius-lg)" }}>
            <span style={{ alignSelf: "flex-start", fontSize: 10, letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", color: "var(--cta-400)", padding: "5px 12px", border: "1px solid var(--cta-line)", borderRadius: 100 }}>Pra obra em execução</span>
            <h3 className="display" style={{ fontSize: "clamp(26px, 3vw, 34px)", color: "#f3ecde", marginTop: 22, marginBottom: 0 }}>DIAGNÓSTICO RUP</h3>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.6)" }}>
              Orçou e começou? Agora meça: compare a produtividade real da sua equipe com o benchmark normativo e receba a severidade do desvio na hora.
            </p>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {["Quiz de 2 etapas, grátis e sem cadastro", "Severidade do desvio na hora", "Laudo técnico completo por R$ 39,90 — pagamento único"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(243,236,222,0.75)" }}>
                  <span style={{ color: "var(--cta-400)", flexShrink: 0, marginTop: 2 }}><CheckIcon size={14} /></span> {item}
                </div>
              ))}
            </div>
            <Link href="/diagnostico" style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, borderRadius: "var(--radius-md)", textDecoration: "none", boxShadow: "var(--cta-glow)" }}>
              <span>Calcular minha RUP</span> <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ comum dos 2 produtos ────────────────────────────────────── */
const HOME_FAQS: [string, string][] = [
  ["Qual a diferença entre as duas calculadoras?", "A Calculadora de Orçamento estima quanto a obra vai custar — material, mão de obra com encargos, BDI e prazo de execução. A Calculadora RUP mede a produtividade de uma equipe que já está executando — compara as horas-homem gastas com o benchmark normativo e aponta a severidade do desvio. Usadas juntas: você orça certo antes de começar e executa medindo."],
  ["Quanto custa usar?", "Os dois quizzes são 100% grátis e sem cadastro. Na Calculadora de Orçamento, o custo final estimado da obra sai grátis na hora; o relatório técnico detalhado com lista de insumos SINAPI será liberado em breve. No Diagnóstico RUP, a prévia com a severidade é gratuita e o laudo técnico completo custa R$ 39,90 — pagamento único, sem assinatura."],
  ["De onde vêm os números?", "Benchmarks de produtividade: TCPO, normativas ABNT e dados reais de campo, anonimizados por tipo de serviço. Custos: base SINAPI 06/2026 com fator regional por estado e encargos sociais de mensalista CLT (coeficiente 1,835). Não é chute de m² — é referência técnica publicada e auditável."],
  ["Preciso ser engenheiro pra usar?", "Não. As ferramentas foram desenhadas pra quem toca obra: construtor, mestre de obras, gestor, investidor. Se você sabe quantas pessoas trabalharam e o que foi executado, consegue usar. O resultado sai em linguagem técnica pronta pra levar pra reunião."],
  ["Os dados da minha obra ficam seguros?", "Sim. Os dados trafegam criptografados e não compartilhamos informações identificáveis de obras ou empresas com terceiros. Apenas indicadores agregados e anonimizados alimentam os benchmarks da plataforma, em conformidade com a LGPD."],
];

function HomeFaqSection() {
  return (
    <section className="section" id="faq" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <div className="container-x">
        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "start" }}>
          <div>
            <span className="t-label t-label-on-cream">DÚVIDAS FREQUENTES</span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 60px)", margin: "20px 0 0", color: "var(--ink-900)", maxWidth: 420 }}>
              O QUE SE PERGUNTA <span style={{ color: "var(--gold-500)" }}>ANTES DE COMEÇAR</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid rgba(11,18,38,0.2)" }}>
            {HOME_FAQS.map(([q, a], i) => (
              <details key={q} open={i === 0} style={{ borderBottom: "1px solid rgba(11,18,38,0.2)" }}>
                <summary style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 0", cursor: "pointer", listStyle: "none" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-600)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="display" style={{ fontSize: 22, color: "var(--ink-900)" }}>{q}</span>
                </summary>
                <div style={{ paddingBottom: 26, paddingLeft: 52, paddingRight: 40, color: "var(--ink-500)", fontSize: 15, lineHeight: 1.65, maxWidth: 720 }}>{a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA final ───────────────────────────────────────────────────── */
function CtaFinalSection() {
  return (
    <section className="section" style={{ background: "var(--navy-900)", borderTop: "1px solid var(--navy-line)" }}>
      <div className="container-x" style={{ textAlign: "center" }}>
        <span className="t-label no-rule">Sem desculpa pra não medir</span>
        <h2 className="display display-xb" style={{ marginTop: 20, fontSize: "clamp(32px, 5vw, 64px)", color: "#f3ecde", lineHeight: 0.95, maxWidth: 860, margin: "20px auto 0" }}>
          PARE DE DESCOBRIR O PREJUÍZO{" "}
          <span style={{ color: "var(--gold-500)" }}>DEPOIS QUE ELE ACONTECE</span>
        </h2>
        <p style={{ marginTop: 22, fontSize: 15, color: "rgba(243,236,222,0.55)", maxWidth: 480, lineHeight: 1.7, margin: "22px auto 0" }}>
          Os dois quizzes são grátis. Cinco minutos hoje valem mais que uma reunião de crise daqui a dois meses.
        </p>
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link href="/orcamento/orcar" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular meu orçamento <ArrowRight />
          </Link>
          <Link href="/diagnostico" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, boxShadow: "var(--cta-glow)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
            Calcular minha RUP <ArrowRight />
          </Link>
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", color: "rgba(243,236,222,0.5)", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Resultado imediato</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Base técnica SINAPI · TCPO</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><CheckIcon />Laudo RUP completo por R$ 39,90</span>
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
              Ferramentas técnicas de orçamento e produtividade para a construção civil brasileira.
            </p>
          </div>
          {[
            { title: "Produtos", items: [["Calculadora de Orçamento", "/orcamento"], ["Diagnóstico RUP", "/diagnostico"], ["Depoimentos", "#cases"], ["FAQ", "#faq"]] },
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
      <HeroVitrine />
      <GanchoSection />
      <ProdutosSection />
      <TestimonialsCarousel />
      <HomeFaqSection />
      <CtaFinalSection />
      <SiteFooter />
      <LiveViewerWidget />
      <RecentActivityToaster />
    </div>
  );
}
