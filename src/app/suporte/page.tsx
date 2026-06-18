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

const EMAIL = "eng.pedroalcazar@gmail.com";

const TOPICS = [
  {
    title: "Não recebi o laudo após o pagamento",
    body: `O laudo é liberado automaticamente após a confirmação do Mercado Pago. Caso não apareça em até 5 minutos, verifique o e-mail informado no quiz (incluindo a pasta de spam). Se o problema persistir, entre em contato pelo e-mail ${EMAIL} informando o e-mail usado e a data/hora do pagamento.`,
  },
  {
    title: "Paguei mas o link do relatório não abre",
    body: "Certifique-se de acessar o link exato enviado por e-mail ou salvo no momento do pagamento. O relatório fica disponível online de forma permanente. Se o link retornar erro, envie-nos o ID do pedido (presente no e-mail de confirmação do Mercado Pago) pelo canal de suporte.",
  },
  {
    title: "Quero solicitar reembolso",
    body: `Por se tratar de produto digital entregue instantaneamente, não há reembolso automático. Em caso de falha técnica comprovada (laudo não gerado após pagamento confirmado), aceitamos solicitação em até 7 dias corridos pelo e-mail ${EMAIL}. Analisamos cada caso individualmente.`,
  },
  {
    title: "Os dados que informei estão incorretos",
    body: "O cálculo de RUP depende diretamente dos dados informados no quiz. Se você identificou um erro nos valores (quantidade, trabalhadores, jornada ou dias), refaça o quiz com os dados corretos — o primeiro resultado gratuito indicará o desvio. Um novo laudo com os dados corrigidos pode ser adquirido normalmente.",
  },
  {
    title: "Como funciona o Pacote de 10 análises?",
    body: "O pacote de R$ 249,90 libera créditos para até 10 laudos completos, válidos por 30 dias a partir da data de compra. Cada laudo é gerado individualmente, para a frente de serviço que você escolher, no seu próprio ritmo. Não há limitação de atividade ou tipo de obra.",
  },
  {
    title: "O laudo substitui uma consultoria presencial?",
    body: "Não. O laudo do Obra Radar é um diagnóstico técnico baseado nos dados informados e em benchmarks normativos. É adequado como subsídio para decisões de gestão de obra, mas não substitui visita técnica presencial, laudo pericial ou consultoria com ART. Para acompanhamento técnico presencial, entre em contato com a Alcazar Engenharia.",
  },
];

export default function SuportePage() {
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
          Central de ajuda
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", color: "#f3ecde", textTransform: "uppercase", marginBottom: 16 }}>
          Suporte
        </h1>
        <p style={{ fontSize: 16, color: "rgba(243,236,222,0.6)", maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
          Encontre respostas para as situações mais comuns. Se não encontrar o que precisa, fale diretamente com a gente.
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {TOPICS.map((item, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(243,236,222,0.1)", padding: "28px 0" }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-500)", flexShrink: 0, marginTop: 4 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#f3ecde", textTransform: "uppercase", marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(243,236,222,0.65)", margin: 0, maxWidth: 680 }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(243,236,222,0.1)", paddingTop: 40 }} />
        </div>

        <div style={{ marginTop: 8, padding: "36px 36px", background: "rgba(201,165,116,0.06)", border: "1px solid rgba(201,165,116,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#f3ecde", textTransform: "uppercase", marginBottom: 8 }}>Não encontrou o que precisava?</p>
            <p style={{ fontSize: 14, color: "rgba(243,236,222,0.55)", margin: 0 }}>Nossa equipe responde em até 1 dia útil.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={`https://wa.me/5544998215665`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", background: "var(--cta-500)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
              WhatsApp (44) 99821-5665
            </a>
            <a href={`mailto:${EMAIL}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px", background: "transparent", color: "var(--gold-500)", border: "1px solid rgba(201,165,116,0.4)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
              E-mail
            </a>
          </div>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/contato" style={{ fontSize: 14, color: "rgba(243,236,222,0.5)", borderBottom: "1px solid rgba(243,236,222,0.2)" }}>Contato</Link>
          <Link href="/termos" style={{ fontSize: 14, color: "rgba(243,236,222,0.5)", borderBottom: "1px solid rgba(243,236,222,0.2)" }}>Termos e privacidade</Link>
        </div>
      </div>
    </div>
  );
}
