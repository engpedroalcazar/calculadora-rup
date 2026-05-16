import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const [total, pagos, porSeveridade, recentes] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { pago: true } }),
      prisma.lead.groupBy({ by: ["severidade"], _count: { id: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 10,
        select: { id: true, nome: true, atividadeNome: true, severidade: true, pago: true, createdAt: true, desvio: true } }),
    ]);

    return NextResponse.json({ total, pagos, porSeveridade, recentes });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
