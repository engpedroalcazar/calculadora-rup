// ROTA TEMPORÁRIA DE TESTE — simula aprovação de pagamento sem MP
// Remove após validar o fluxo em produção
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { leadId } = await req.json();
    if (!leadId) return NextResponse.json({ error: "leadId obrigatório" }, { status: 400 });

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });

    if (lead.pago) {
      return NextResponse.json({ ok: true, already: true, url: `/relatorio/${leadId}`, msg: "Já estava pago" });
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: { pago: true, valor: 39.9 },
    });

    return NextResponse.json({
      ok: true,
      url: `/relatorio/${leadId}`,
      msg: "Lead marcado como pago (simulação de teste)",
    });
  } catch (err) {
    console.error("[simular-pagamento]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
