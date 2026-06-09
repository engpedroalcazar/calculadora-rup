import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  return token === process.env.ADMIN_TOKEN;
}

// Aceita: 7d, 30d, 90d, all (default all)
function dataInicialDe(periodo: string): Date | null {
  const dias = periodo === "7d" ? 7 : periodo === "30d" ? 30 : periodo === "90d" ? 90 : 0;
  if (dias === 0) return null;
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page") ?? "1"));
    const limit = Math.min(200, Math.max(10, Number(sp.get("limit") ?? "50")));
    const pago = sp.get("pago") ?? "";
    const periodo = sp.get("periodo") ?? "all";
    const busca = (sp.get("busca") ?? "").trim();

    type LeadWhere = {
      pago?: boolean;
      createdAt?: { gte: Date };
      OR?: Array<Record<string, unknown>>;
    };
    const where: LeadWhere = {};
    if (pago === "sim") where.pago = true;
    if (pago === "nao") where.pago = false;

    const dataIni = dataInicialDe(periodo);
    if (dataIni) where.createdAt = { gte: dataIni };

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: "insensitive" } },
        { email: { contains: busca, mode: "insensitive" } },
        { cidade: { contains: busca, mode: "insensitive" } },
        { whatsapp: { contains: busca } },
      ];
    }

    const [total, leads, totalPagos, somaPago] = await Promise.all([
      prisma.orcamentoLead.count({ where }),
      prisma.orcamentoLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          itens: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              atividadeNome: true,
              unidade: true,
              quantidade: true,
              padraoAcabamento: true,
              custoDireto: true,
              origem: true,
            },
          },
        },
      }),
      prisma.orcamentoLead.count({ where: { ...where, pago: true } }),
      prisma.orcamentoLead.aggregate({
        where: { ...where, pago: true },
        _sum: { valor: true },
      }),
    ]);

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      stats: {
        totalLeads: total,
        totalPagos,
        receita: somaPago._sum.valor ?? 0,
        ticketMedio: totalPagos > 0 ? (somaPago._sum.valor ?? 0) / totalPagos : 0,
      },
    });
  } catch (err) {
    console.error("[admin/orcamento/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids obrigatório (array)" }, { status: 400 });
    }
    const result = await prisma.orcamentoLead.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("[admin/orcamento/leads DELETE]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
