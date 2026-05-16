import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailLaudoPronto, emailPacoteAtivado } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ ok: true });
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "Token não configurado" }, { status: 500 });

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("[mp/webhook] Erro ao consultar pagamento", body.data.id);
      return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 502 });
    }

    const payment = await res.json();
    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true, status: payment.status });
    }

    // external_reference = "leadId|plano"
    const ref = payment.external_reference ?? "";
    const [leadId, plano] = ref.includes("|") ? ref.split("|") : [ref, "individual"];

    if (!leadId) {
      console.error("[mp/webhook] external_reference ausente", payment.id);
      return NextResponse.json({ ok: true });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ ok: true });

    // Marca o lead como pago
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        pago: true,
        valor: payment.transaction_amount,
        metodoPagamento: payment.payment_type_id ?? null,
      },
    });

    // ── Pacote: cria registro de créditos se for compra de pacote ───────────
    if (plano === "pacote" && lead.email) {
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 30);

      const pacote = await prisma.pacote.create({
        data: {
          email: lead.email.toLowerCase(),
          total: 10,
          usado: 1, // 1 já consumido neste lead
          ativo: true,
          leadId,
          expiraEm,
        },
      });

      // Email de confirmação do pacote
      await emailPacoteAtivado({
        to: lead.email,
        nome: lead.nome,
        total: pacote.total,
        usado: pacote.usado,
        expiraEm: pacote.expiraEm,
      });
    }

    // ── Email com link do laudo (individual e pacote) ────────────────────────
    if (lead.email) {
      await emailLaudoPronto({
        to: lead.email,
        nome: lead.nome,
        leadId,
        atividadeNome: lead.atividadeNome,
        severidade: lead.severidade,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[mp/webhook]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
