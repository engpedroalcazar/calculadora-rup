import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    if (lead.pago) return NextResponse.json({ ok: true, already: true, url: `/relatorio/${id}` });

    const body = await req.json().catch(() => ({}));
    const plano: "individual" | "pacote" = body.plano === "pacote" ? "pacote" : "individual";
    const precoIndividual = Number(process.env.NEXT_PUBLIC_PRECO ?? 39.9);
    const precoPacote = 249.9;
    const preco = plano === "pacote" ? precoPacote : precoIndividual;

    const token = process.env.MP_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

    // ── Verifica se o email do lead tem Pacote ativo com créditos ───────────
    if (lead.email && plano === "individual") {
      const pacote = await prisma.pacote.findFirst({
        where: {
          email: { equals: lead.email, mode: "insensitive" },
          ativo: true,
          expiraEm: { gt: new Date() },
          usado: { lt: 10 },
        },
        orderBy: { createdAt: "asc" }, // usa o mais antigo primeiro
      });

      if (pacote) {
        // Consome 1 crédito e libera o relatório sem pagamento MP
        await prisma.$transaction([
          prisma.pacote.update({
            where: { id: pacote.id },
            data: {
              usado: { increment: 1 },
              ativo: pacote.usado + 1 < pacote.total, // desativa quando esgotar
            },
          }),
          prisma.lead.update({
            where: { id },
            data: { pago: true, valor: 0, metodoPagamento: "pacote" },
          }),
        ]);
        return NextResponse.json({ ok: true, url: `/relatorio/${id}`, credito: true, restantes: pacote.total - pacote.usado - 1 });
      }
    }

    // ── Sem token: simula pagamento (modo desenvolvimento) ───────────────────
    if (!token) {
      await prisma.lead.update({ where: { id }, data: { pago: true, valor: preco } });
      return NextResponse.json({ ok: true, url: `/relatorio/${id}` });
    }

    // ── Com token: cria preferência no Mercado Pago ──────────────────────────
    const mpBody = {
      items: [
        {
          id,
          title: plano === "pacote"
            ? `Pacote 10 Análises RUP — ObraRadar`
            : `Relatório RUP — ${lead.atividadeNome}`,
          description: plano === "pacote"
            ? "10 diagnósticos de produtividade de mão de obra (30 dias)"
            : "Diagnóstico completo de produtividade de mão de obra",
          quantity: 1,
          currency_id: "BRL",
          unit_price: preco,
        },
      ],
      payer: {
        name: lead.nome,
        ...(lead.email ? { email: lead.email } : {}),
      },
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 1,
      },
      metadata: { plano }, // usado no webhook para distinguir individual x pacote
      back_urls: {
        success: `${appUrl}/relatorio/${id}`,
        failure: `${appUrl}/checkout?id=${id}&erro=pagamento`,
        pending: `${appUrl}/checkout?id=${id}&pendente=1`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhook/mp`,
      external_reference: `${id}|${plano}`, // id|plano separados por pipe
      statement_descriptor: "ObraRadar",
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(mpBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[mp/preference]", err);
      return NextResponse.json({ error: "Erro ao criar preferência MP" }, { status: 502 });
    }

    const preference = await res.json();
    const isSandbox = process.env.MP_SANDBOX === "true";
    const url = isSandbox ? preference.sandbox_init_point : preference.init_point;
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
