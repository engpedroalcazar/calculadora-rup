import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span style={{ display: "inline-flex", width: 34, height: 34, borderRadius: 9, overflow: "hidden", flexShrink: 0 }}>
        <Image src="/logos/orcamento/obraradar-icon.jpg" alt="Obra Radar" width={34} height={34} style={{ objectFit: "cover" }} />
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#f3ecde", letterSpacing: "0.03em", textTransform: "uppercase" }}>OBRA RADAR</span>
    </div>
  );
}

export default function ContatoPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/"><Logo /></Link>
          <Link href="/diagnostico" style={{ padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "var(--gold-500)", border: "1px solid rgba(201,165,116,0.4)", borderRadius: 10 }}>
            Calcular grátis
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 24px 96px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700, marginBottom: 16 }}>
          Fale conosco
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", color: "#f3ecde", textTransform: "uppercase", marginBottom: 16 }}>
          Contato
        </h1>
        <p style={{ fontSize: 16, color: "rgba(243,236,222,0.6)", maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
          Para dúvidas sobre o produto, problemas com seu laudo ou informações comerciais, entre em contato pelos canais abaixo.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
              label: "E-mail",
              value: "eng.pedroalcazar@gmail.com",
              href: "mailto:eng.pedroalcazar@gmail.com",
              sub: "Respondemos em até 1 dia útil",
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
              label: "WhatsApp",
              value: "(44) 99821-5665",
              href: "https://wa.me/5544998215665",
              sub: "Seg–Sex, 08h–18h · Maringá/PR",
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
              label: "Horário de atendimento",
              value: "Segunda a Sexta",
              href: undefined,
              sub: "08h às 18h · Horário de Brasília",
            },
          ].map((item) => (
            <div key={item.label} style={{ padding: "28px 28px", background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: 12 }}>
              <div style={{ color: "var(--gold-500)", marginBottom: 14 }}>{item.icon}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "rgba(243,236,222,0.4)", marginBottom: 8 }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ fontSize: 15, fontWeight: 600, color: "#f3ecde", display: "block", marginBottom: 6 }}>{item.value}</a>
              ) : (
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f3ecde", marginBottom: 6 }}>{item.value}</div>
              )}
              <div style={{ fontSize: 13, color: "rgba(243,236,222,0.45)" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, padding: "28px 32px", background: "rgba(201,165,116,0.06)", border: "1px solid rgba(201,165,116,0.2)", borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(243,236,222,0.55)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "rgba(243,236,222,0.8)" }}>Obra Radar</strong> é operado por{" "}
            <a href="https://alcazarengenharia.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-500)" }}>Alcazar Engenharia</a>
            {" "}· P H Alcazar Brito Engenharia · CNPJ 61.288.947/0001-34 · Maringá/PR
          </p>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/suporte" style={{ fontSize: 14, color: "rgba(243,236,222,0.5)", borderBottom: "1px solid rgba(243,236,222,0.2)" }}>Central de suporte</Link>
          <Link href="/termos" style={{ fontSize: 14, color: "rgba(243,236,222,0.5)", borderBottom: "1px solid rgba(243,236,222,0.2)" }}>Termos e privacidade</Link>
        </div>
      </div>
    </div>
  );
}
