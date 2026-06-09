// Envio de email do produto Calculadora de Orçamento (ORC).
//
// Independente do src/lib/email.ts do RUP — por decisão da Sessão 0 da unificação,
// nenhum arquivo existente do RUP em produção pode ser modificado. Replicamos aqui
// a mesma técnica (Resend via REST, sem npm package) escopada para o namespace ORC.
//
// Padrões herdados do RUP:
// - Silencioso quando RESEND_API_KEY ou destinatário ausentes (não trava o fluxo)
// - HTML inline (template literal) com paleta navy/cream/gold da marca
// - Domínio único: noreply@obraradarapp.com

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://obraradarapp.com";
const FROM = "ObraRadar <noreply@obraradarapp.com>";

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) console.error("[orcamento/email] Resend error", await res.text());
  } catch (e) {
    console.error("[orcamento/email] send failed", e);
  }
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export async function emailOrcamentoPronto(opts: {
  to: string;
  nome: string;
  leadId: string;
  custoFinal: number;
  qtdeItens: number;
  uf: string;
  cidade?: string | null;
  bdiPercentual: number;
}) {
  const resultadoUrl = `${APP_URL}/orcamento/resultado/${opts.leadId}`;
  const numeroPedido = `ORC-${opts.leadId.slice(-8).toUpperCase()}`;
  const local = opts.cidade ? `${opts.cidade}/${opts.uf}` : opts.uf;
  const servicosLabel = opts.qtdeItens === 1 ? "1 serviço" : `${opts.qtdeItens} serviços`;

  await send(
    opts.to,
    `Seu orçamento de obra está pronto — ${formatBRL(opts.custoFinal)} · ObraRadar`,
    `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#0b1226;border-radius:16px;overflow:hidden">
    <div style="padding:32px 32px 0;text-align:center">
      <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a574;font-weight:700">OBRA RADAR · CALCULADORA DE ORÇAMENTO</p>
      <h1 style="margin:16px 0 8px;font-size:24px;color:#f3ecde;font-weight:800">Seu orçamento está pronto</h1>
      <p style="margin:0;color:rgba(243,236,222,0.6);font-size:15px">Olá, <strong style="color:#f3ecde">${opts.nome}</strong>. O custo estimado da sua obra foi calculado com base na SINAPI 06/2026.</p>
    </div>
    <div style="padding:24px 32px">
      <div style="background:#c9a574;border-radius:12px;padding:20px;margin-bottom:20px;text-align:center">
        <p style="margin:0 0 4px;font-size:11px;color:rgba(11,18,38,0.7);text-transform:uppercase;letter-spacing:0.15em;font-weight:700">Custo final estimado</p>
        <p style="margin:0;font-size:32px;font-weight:900;color:#0b1226;letter-spacing:-0.02em">${formatBRL(opts.custoFinal)}</p>
      </div>
      <div style="background:rgba(243,236,222,0.05);border:1px solid rgba(243,236,222,0.12);border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <table style="width:100%;font-size:13px;color:rgba(243,236,222,0.75);border-collapse:collapse">
          <tr><td style="padding:4px 0">Pedido</td><td style="padding:4px 0;text-align:right;font-family:monospace;color:#f3ecde;font-weight:700">${numeroPedido}</td></tr>
          <tr><td style="padding:4px 0">Serviços</td><td style="padding:4px 0;text-align:right;color:#f3ecde;font-weight:700">${servicosLabel}</td></tr>
          <tr><td style="padding:4px 0">Local</td><td style="padding:4px 0;text-align:right;color:#f3ecde;font-weight:700">${local}</td></tr>
          <tr><td style="padding:4px 0">BDI</td><td style="padding:4px 0;text-align:right;color:#f3ecde;font-weight:700">${opts.bdiPercentual}%</td></tr>
        </table>
      </div>
      <a href="${resultadoUrl}" style="display:block;text-align:center;padding:16px 24px;background:#c9a574;color:#0b1226;text-decoration:none;border-radius:10px;font-size:16px;font-weight:800;letter-spacing:0.04em">
        Ver orçamento completo →
      </a>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;color:rgba(243,236,222,0.35)">
        Ou acesse: <a href="${resultadoUrl}" style="color:#c9a574">${resultadoUrl}</a>
      </p>
      <p style="margin:24px 0 0;padding:16px 20px;background:rgba(243,236,222,0.04);border-radius:10px;font-size:12px;line-height:1.6;color:rgba(243,236,222,0.55)">
        Este orçamento mostra o custo final, a composição material/mão de obra/BDI e a equipe sugerida. Destrave o relatório completo no link acima para ver a <strong style="color:#f3ecde">lista de insumos com preço SINAPI unitário</strong>, mão de obra por categoria profissional e exportação em PDF.
      </p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(243,236,222,0.08);text-align:center">
      <p style="margin:0;font-size:11px;color:rgba(243,236,222,0.3);line-height:1.6">
        ObraRadar · Alcazar Engenharia · CNPJ 61.288.947/0001-34 · Maringá/PR<br>
        Base SINAPI 06/2026 · estimativa técnica · não substitui orçamento de obra elaborado por profissional habilitado<br>
        <a href="${APP_URL}/orcamento/suporte" style="color:rgba(243,236,222,0.4)">Suporte</a> · <a href="${APP_URL}/termos" style="color:rgba(243,236,222,0.4)">Termos</a>
      </p>
    </div>
  </div>
</body></html>
    `,
  );
}
