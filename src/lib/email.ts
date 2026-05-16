const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calculadora-rup-byhx.vercel.app";
const FROM = "ObraRadar <noreply@obraradarapp.com>";

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return; // silencioso se não configurado
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) console.error("[email] Resend error", await res.text());
  } catch (e) {
    console.error("[email] send failed", e);
  }
}

export async function emailLaudoPronto(opts: {
  to: string; nome: string; leadId: string; atividadeNome: string; severidade: string;
}) {
  const url = `${APP_URL}/relatorio/${opts.leadId}`;
  const corSev: Record<string, string> = {
    CRÍTICO: "#ef4444", ALERTA: "#f97316", ATENÇÃO: "#eab308", NORMAL: "#22c55e", VERIFICAR: "#3b82f6",
  };
  const cor = corSev[opts.severidade] ?? "#6b7280";

  await send(opts.to, "Seu laudo de produtividade está pronto — ObraRadar", `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#0b1226;border-radius:16px;overflow:hidden">
    <div style="padding:32px 32px 0;text-align:center">
      <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a574;font-weight:700">OBRA RADAR</p>
      <h1 style="margin:16px 0 8px;font-size:24px;color:#f3ecde;font-weight:800">Seu laudo está pronto</h1>
      <p style="margin:0;color:rgba(243,236,222,0.6);font-size:15px">Olá, <strong style="color:#f3ecde">${opts.nome}</strong>. O diagnóstico de produtividade da sua frente de serviço foi gerado.</p>
    </div>
    <div style="padding:24px 32px">
      <div style="background:rgba(243,236,222,0.05);border:1px solid rgba(243,236,222,0.12);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:12px;color:rgba(243,236,222,0.5);text-transform:uppercase;letter-spacing:0.15em">Atividade analisada</p>
        <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#f3ecde">${opts.atividadeNome}</p>
        <span style="display:inline-block;padding:4px 14px;border-radius:100px;font-size:12px;font-weight:800;letter-spacing:0.1em;background:${cor}22;color:${cor};border:1px solid ${cor}44">${opts.severidade}</span>
      </div>
      <a href="${url}" style="display:block;text-align:center;padding:16px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:800;letter-spacing:0.04em">
        Ver laudo completo →
      </a>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;color:rgba(243,236,222,0.35)">
        Ou acesse: <a href="${url}" style="color:#c9a574">${url}</a>
      </p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(243,236,222,0.08);text-align:center">
      <p style="margin:0;font-size:11px;color:rgba(243,236,222,0.3)">
        ObraRadar · Alcazar Engenharia · CNPJ 61.288.947/0001-34 · Maringá/PR<br>
        <a href="${APP_URL}/suporte" style="color:rgba(243,236,222,0.4)">Suporte</a> · <a href="${APP_URL}/termos" style="color:rgba(243,236,222,0.4)">Termos</a>
      </p>
    </div>
  </div>
</body></html>
  `);
}

export async function emailPacoteAtivado(opts: {
  to: string; nome: string; total: number; usado: number; expiraEm: Date;
}) {
  const restantes = opts.total - opts.usado;
  const expira = opts.expiraEm.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  await send(opts.to, `Pacote ativado — ${restantes} análises disponíveis · ObraRadar`, `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#0b1226;border-radius:16px;overflow:hidden">
    <div style="padding:32px 32px 0;text-align:center">
      <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a574;font-weight:700">OBRA RADAR</p>
      <h1 style="margin:16px 0 8px;font-size:24px;color:#f3ecde;font-weight:800">Pacote ativado com sucesso</h1>
      <p style="margin:0;color:rgba(243,236,222,0.6);font-size:15px">Olá, <strong style="color:#f3ecde">${opts.nome}</strong>. Seu pacote de ${opts.total} análises está ativo.</p>
    </div>
    <div style="padding:24px 32px">
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
        <p style="margin:0 0 4px;font-size:40px;font-weight:900;color:#10b981">${restantes}</p>
        <p style="margin:0;font-size:13px;color:rgba(243,236,222,0.6)">análises restantes · válidas até ${expira}</p>
      </div>
      <p style="margin:0 0 20px;font-size:14px;color:rgba(243,236,222,0.65);text-align:center">
        Para usar as próximas análises, <strong style="color:#f3ecde">use o mesmo e-mail</strong> (${opts.to}) ao preencher o quiz. O crédito será aplicado automaticamente no checkout.
      </p>
      <a href="${APP_URL}/diagnostico" style="display:block;text-align:center;padding:16px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:800;letter-spacing:0.04em">
        Iniciar nova análise →
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(243,236,222,0.08);text-align:center">
      <p style="margin:0;font-size:11px;color:rgba(243,236,222,0.3)">
        ObraRadar · Alcazar Engenharia · CNPJ 61.288.947/0001-34<br>
        <a href="${APP_URL}/suporte" style="color:rgba(243,236,222,0.4)">Suporte</a>
      </p>
    </div>
  </div>
</body></html>
  `);
}
