import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    if (lead.pago) return NextResponse.json({ ok: true, already: true, url: `/relatorio/${id}` });

    const preco = Number(process.env.NEXT_PUBLIC_PRECO ?? 29.9);
    const token = process.env.MP_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

    // Sem token: simula pagamento (modo desenvolvimento)
    if (!token) {
      await prisma.lead.update({
        where: { id },
        data: { pago: true, valor: preco },
      });
      return NextResponse.json({ ok: true, url: `/relatorio/${id}` });
    }

    // Com token: cria preferência no Mercado Pago Checkout Pro
    const body = {
      items: [
        {
          id,
          title: `Relatório RUP — ${lead.atividadeNome}`,
          description: "Diagnóstico completo de produtividade de mão de obra",
          quantity: 1,
          currency_id: "BRL",
          unit_price: preco,
        },
      ],
      payer: {
        name: lead.nome,
        ...(lead.email ? { email: lead.email } : {}),
      },
      back_urls: {
        success: `${appUrl}/relatorio/${id}`,
        failure: `${appUrl}/checkout?id=${id}&erro=pagamento`,
        pending: `${appUrl}/checkout?id=${id}&pendente=1`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhook/mp`,
      external_reference: id,
      statement_descriptor: "ObraRadar",
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[mp/preference]", err);
      return NextResponse.json({ error: "Erro ao criar preferência MP" }, { status: 502 });
    }

    const preference = await res.json();
    return NextResponse.json({ ok: true, url: preference.init_point });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
