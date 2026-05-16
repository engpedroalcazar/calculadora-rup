import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  return req.nextUrl.searchParams.get("token") === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [allRecent, allPaid, bySevAll, bySevPaid, topAtividades] = await Promise.all([
      // Leads últimos 30 dias
      prisma.lead.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, pago: true, valor: true },
        orderBy: { createdAt: "asc" },
      }),
      // Todos os pagos (lista completa)
      prisma.lead.findMany({
        where: { pago: true },
        select: { id: true, nome: true, atividadeNome: true, severidade: true, valor: true, createdAt: true, email: true },
        orderBy: { createdAt: "desc" },
      }),
      // Contagem total por severidade
      prisma.lead.groupBy({ by: ["severidade"], _count: { id: true } }),
      // Contagem pagos por severidade
      prisma.lead.groupBy({ by: ["severidade"], where: { pago: true }, _count: { id: true } }),
      // Top atividades
      prisma.lead.groupBy({
        by: ["atividadeNome"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
    ]);

    // Montar séries de 30 dias
    const leadsByDay: Record<string, number> = {};
    const revenueByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      leadsByDay[key] = 0;
      revenueByDay[key] = 0;
    }
    for (const l of allRecent) {
      const key = l.createdAt.toISOString().split("T")[0];
      if (key in leadsByDay) {
        leadsByDay[key]++;
        if (l.pago && l.valor) revenueByDay[key] += Number(l.valor);
      }
    }

    // Conversão por severidade
    const paidMap = Object.fromEntries(bySevPaid.map(s => [s.severidade, s._count.id]));
    const conversionBySev = bySevAll.map(s => ({
      severidade: s.severidade,
      total: s._count.id,
      pagos: paidMap[s.severidade] ?? 0,
      taxa: s._count.id > 0 ? ((paidMap[s.severidade] ?? 0) / s._count.id) * 100 : 0,
    })).sort((a, b) => b.total - a.total);

    // Ticket médio
    const totalReceita = allPaid.reduce((sum, l) => sum + Number(l.valor ?? 39.9), 0);
    const ticketMedio = allPaid.length > 0 ? totalReceita / allPaid.length : 0;

    return NextResponse.json({
      leadsByDay: Object.entries(leadsByDay).map(([date, count]) => ({ date, count })),
      revenueByDay: Object.entries(revenueByDay).map(([date, amount]) => ({ date, amount })),
      paidLeads: allPaid.map(l => ({ ...l, valor: Number(l.valor ?? 39.9) })),
      conversionBySev,
      topAtividades: topAtividades.map(a => ({ nome: a.atividadeNome, count: a._count.id })),
      ticketMedio,
      totalReceita,
    });
  } catch (err) {
    console.error("[analytics]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
