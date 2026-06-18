import Link from "next/link";
import Image from "next/image";

const EMPRESA = "P H Alcazar Brito Engenharia";
const FANTASIA = "Alcazar Engenharia";
const CNPJ = "61.288.947/0001-34";
const CIDADE = "Maringá/PR";
const EMAIL = "eng.pedroalcazar@gmail.com";
const WHATSAPP = "(44) 99821-5665";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#f3ecde", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(243,236,222,0.1)" }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(243,236,222,0.7)" }}>
        {children}
      </div>
    </div>
  );
}

export default function TermosPage() {
  const updated = "16 de maio de 2026";
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
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700, marginBottom: 16 }}>
            Documentação Legal
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", color: "#f3ecde", textTransform: "uppercase", marginBottom: 16 }}>
            Termos de Uso e Política de Privacidade
          </h1>
          <p style={{ fontSize: 14, color: "rgba(243,236,222,0.45)" }}>
            Última atualização: {updated} · CNPJ {CNPJ}
          </p>
        </div>

        <Section title="1. Sobre o Obra Radar">
          <p>O <strong style={{ color: "#f3ecde" }}>Obra Radar</strong> é uma plataforma de diagnóstico de produtividade de mão de obra para a construção civil, operada por <strong style={{ color: "#f3ecde" }}>{EMPRESA}</strong> (nome fantasia: {FANTASIA}), CNPJ {CNPJ}, {CIDADE}. A plataforma permite que engenheiros, mestres de obras e gestores calculem a Razão Unitária de Produção (RUP) de frentes de serviço e obtenham laudos técnicos comparativos com benchmarks normativos.</p>
          <p style={{ marginTop: 12 }}>Ao acessar e utilizar o Obra Radar, você declara ter lido, compreendido e concordado com estes Termos de Uso e com a Política de Privacidade aqui descritos.</p>
        </Section>

        <Section title="2. Serviços oferecidos">
          <p><strong style={{ color: "#f3ecde" }}>Quiz gratuito:</strong> o preenchimento do formulário de dados de obra e equipe é gratuito. O usuário recebe, sem custo, uma prévia com o nível de severidade identificado.</p>
          <p style={{ marginTop: 12 }}><strong style={{ color: "#f3ecde" }}>Laudo técnico completo (pago):</strong> o relatório detalhado — com RUP calculada, desvio percentual, diagnóstico por fator de influência, causas prováveis e recomendações de ação — é disponibilizado mediante pagamento único de R$ 39,90 (plano individual) ou R$ 249,90 (pacote de até 10 análises, válido por 30 dias). Os preços podem ser alterados com aviso prévio de 7 dias.</p>
          <p style={{ marginTop: 12 }}>O acesso ao laudo é imediato após a confirmação do pagamento e permanece disponível online por prazo indeterminado.</p>
        </Section>

        <Section title="3. Pagamentos e reembolsos">
          <p>Os pagamentos são processados exclusivamente por meio do <strong style={{ color: "#f3ecde" }}>Mercado Pago</strong>, plataforma certificada PCI-DSS. O Obra Radar não armazena dados de cartão de crédito ou informações bancárias. Todos os dados financeiros transitam e são gerenciados integralmente pelo provedor de pagamento.</p>
          <p style={{ marginTop: 12 }}>Após a liberação do laudo, não há reembolso automático, uma vez que o produto digital é entregue instantaneamente. Em caso de falha técnica comprovada (laudo não gerado após pagamento confirmado), o usuário poderá solicitar reembolso integral pelo canal de suporte em até 7 dias corridos.</p>
          <p style={{ marginTop: 12 }}>Para solicitações de reembolso: <strong style={{ color: "#f3ecde" }}>{EMAIL}</strong> ou WhatsApp {WHATSAPP}.</p>
        </Section>

        <Section title="4. Coleta e uso de dados">
          <p>O Obra Radar coleta os seguintes dados para prestação do serviço:</p>
          <ul style={{ marginTop: 12, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong style={{ color: "#f3ecde" }}>Dados de identificação:</strong> nome, e-mail, WhatsApp e cidade, informados voluntariamente no quiz.</li>
            <li><strong style={{ color: "#f3ecde" }}>Dados de obra:</strong> atividade, quantidade executada, número de trabalhadores, jornada diária, dias trabalhados e custo de mão de obra (opcional).</li>
            <li><strong style={{ color: "#f3ecde" }}>Dados de pagamento:</strong> processados pelo Mercado Pago; não armazenamos dados de cartão.</li>
            <li><strong style={{ color: "#f3ecde" }}>Dados de navegação:</strong> logs de acesso e dados técnicos para funcionamento da plataforma.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Os dados coletados são utilizados exclusivamente para: (a) gerar e entregar o laudo técnico; (b) melhorar o benchmark de referência da plataforma, com dados sempre anonimizados; (c) comunicação relacionada ao serviço contratado.</p>
        </Section>

        <Section title="5. Compartilhamento de dados">
          <p>O Obra Radar <strong style={{ color: "#f3ecde" }}>não vende, aluga ou compartilha</strong> dados pessoais ou informações de obras com terceiros para fins comerciais.</p>
          <p style={{ marginTop: 12 }}>Dados poderão ser compartilhados somente nas seguintes situações: (a) com o processador de pagamento (Mercado Pago), exclusivamente para operação da transação; (b) por determinação judicial ou exigência legal, nos limites da legislação brasileira; (c) para proteção dos direitos e segurança da plataforma.</p>
        </Section>

        <Section title="6. Segurança dos dados">
          <p>Adotamos as seguintes medidas técnicas de segurança:</p>
          <ul style={{ marginTop: 12, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Comunicação por protocolo HTTPS com certificado TLS</li>
            <li>Banco de dados hospedado em infraestrutura Supabase (PostgreSQL) com criptografia em repouso</li>
            <li>Acesso administrativo protegido por token seguro</li>
            <li>Sem armazenamento local de senhas ou dados de pagamento</li>
          </ul>
          <p style={{ marginTop: 12 }}>Em caso de incidente de segurança que afete dados pessoais, notificaremos os usuários afetados nos prazos previstos pela LGPD.</p>
        </Section>

        <Section title="7. Direitos do titular (LGPD)">
          <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), o usuário tem direito a:</p>
          <ul style={{ marginTop: 12, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Confirmar a existência de tratamento de seus dados pessoais</li>
            <li>Solicitar acesso aos dados que temos armazenados</li>
            <li>Solicitar correção de dados incompletos, inexatos ou desatualizados</li>
            <li>Solicitar exclusão dos dados pessoais (exceto quando há obrigação legal de retenção)</li>
            <li>Revogar o consentimento para tratamento de dados, quando aplicável</li>
          </ul>
          <p style={{ marginTop: 12 }}>Solicitações pelo e-mail <strong style={{ color: "#f3ecde" }}>{EMAIL}</strong> ou WhatsApp {WHATSAPP}. Atendemos em até 15 dias úteis.</p>
        </Section>

        <Section title="8. Limitação de responsabilidade">
          <p>O laudo gerado pelo Obra Radar é um documento técnico de diagnóstico de produtividade baseado em benchmarks normativos e dados informados pelo próprio usuário. Não substitui laudo pericial com Anotação de Responsabilidade Técnica (ART), nem consultoria técnica presencial.</p>
          <p style={{ marginTop: 12 }}>O Obra Radar não se responsabiliza por decisões tomadas com base exclusiva no laudo, por dados incorretos informados pelo usuário, ou por variações de produtividade decorrentes de fatores não contemplados no modelo de cálculo.</p>
        </Section>

        <Section title="9. Propriedade intelectual">
          <p>Todo o conteúdo da plataforma — textos, interface, algoritmos de cálculo, banco de atividades e laudos gerados — é de propriedade exclusiva de {EMPRESA} (nome fantasia: {FANTASIA}). É vedada a reprodução, distribuição ou uso comercial sem autorização expressa e por escrito.</p>
        </Section>

        <Section title="10. Alterações nestes Termos">
          <p>Estes Termos podem ser atualizados periodicamente. Alterações relevantes serão comunicadas por e-mail ou aviso na plataforma com antecedência mínima de 7 dias. O uso continuado do serviço após a vigência das alterações implica aceitação dos novos Termos.</p>
        </Section>

        <Section title="11. Foro e legislação aplicável">
          <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de {CIDADE} para dirimir quaisquer controvérsias decorrentes deste instrumento, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.</p>
        </Section>

        <div style={{ marginTop: 64, padding: "24px 28px", background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: 12, fontSize: 13, color: "rgba(243,236,222,0.5)", lineHeight: 1.7 }}>
          <strong style={{ color: "rgba(243,236,222,0.7)" }}>{FANTASIA}</strong>
          {" "}· {EMPRESA} · CNPJ {CNPJ} · {CIDADE}
          {" "}· <a href={`mailto:${EMAIL}`} style={{ color: "var(--gold-500)" }}>{EMAIL}</a>
          {" "}· <a href="https://alcazarengenharia.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-500)" }}>alcazarengenharia.com</a>
        </div>
      </div>
    </div>
  );
}
