import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envia type="payment" com data.id quando um pagamento é confirmado
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ ok: true }); // outros eventos: ignorar silenciosamente
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "Token não configurado" }, { status: 500 });

    // Consulta o pagamento na API do MP para confirmar status
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

    const leadId = payment.external_reference;
    if (!leadId) {
      console.error("[mp/webhook] external_reference ausente", payment.id);
      return NextResponse.json({ ok: true });
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: { pago: true, valor: payment.transaction_amount },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[mp/webhook]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
