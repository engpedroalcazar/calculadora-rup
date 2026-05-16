import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id, valor } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        pago: true,
        valor: valor ?? Number(process.env.NEXT_PUBLIC_PRECO ?? 39.9),
      },
    });

    return NextResponse.json({ ok: true, id: updated.id, pago: updated.pago, valor: updated.valor });
  } catch (err) {
    console.error("[mark-paid]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
