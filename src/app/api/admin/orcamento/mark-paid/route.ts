import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Marca um OrcamentoLead como pago manualmente (uso de suporte enquanto MP
// não está integrado — Iter #6). Aceita valor e método opcionais; defaults:
// R$ 29,90 (preço individual do orçamento) / "manual".
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id, valor, metodoPagamento } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const lead = await prisma.orcamentoLead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });

    const updated = await prisma.orcamentoLead.update({
      where: { id },
      data: {
        pago: true,
        valor: typeof valor === "number" ? valor : 29.9,
        metodoPagamento: metodoPagamento ?? "manual",
      },
    });

    return NextResponse.json({
      ok: true,
      id: updated.id,
      pago: updated.pago,
      valor: updated.valor,
      metodoPagamento: updated.metodoPagamento,
    });
  } catch (err) {
    console.error("[admin/orcamento/mark-paid]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
