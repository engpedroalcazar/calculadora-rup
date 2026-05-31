// Endpoint dev-only para destravar um lead sem checkout real.
// Protegido por NODE_ENV — em produção retorna 404 silencioso.
// Usado pelo botão DevUnlockButton enquanto a integração Mercado Pago não está
// disponível (vem na Iter #6).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ leadId: string }> };

export async function POST(_req: Request, { params }: Params) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const { leadId } = await params;
  if (!leadId) {
    return NextResponse.json({ erro: "leadId obrigatório." }, { status: 400 });
  }

  const lead = await prisma.orcamentoLead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ erro: "Lead não encontrado." }, { status: 404 });
  }

  await prisma.orcamentoLead.update({
    where: { id: leadId },
    data: {
      pago: true,
      valor: 29.9,
      metodoPagamento: "dev-unlock",
    },
  });

  return NextResponse.json({ ok: true });
}
