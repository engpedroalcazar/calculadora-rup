import { NextRequest, NextResponse } from "next/server";
import type { Lead } from "@prisma/client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  return token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const sp = req.nextUrl.searchParams;
    const format = sp.get("format");
    const page = Math.max(1, Number(sp.get("page") ?? "1"));
    const limit = Math.min(200, Math.max(10, Number(sp.get("limit") ?? "50")));
    const severidade = sp.get("severidade") ?? "";
    const pago = sp.get("pago") ?? "";
    const busca = (sp.get("busca") ?? "").trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (severidade) where.severidade = severidade;
    if (pago === "sim") where.pago = true;
    if (pago === "nao") where.pago = false;
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: "insensitive" } },
        { email: { contains: busca, mode: "insensitive" } },
        { whatsapp: { contains: busca } },
        { cidade: { contains: busca, mode: "insensitive" } },
      ];
    }

    if (format === "csv") {
      const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
      const header = "id,nome,whatsapp,email,perfil,tipoObra,cidade,atividadeNome,severidade,desvio,rupReal,rupRef,hhTotal,pago,createdAt";
      const rows = leads.map((l: Lead) =>
        [l.id, `"${l.nome}"`, l.whatsapp, l.email ?? "", l.perfil ?? "", l.tipoObra ?? "",
         l.cidade ?? "", `"${l.atividadeNome}"`, l.severidade,
         l.desvio.toFixed(2), l.rupReal.toFixed(3), l.rupRef.toFixed(3),
         l.hhTotal.toFixed(1), l.pago ? "sim" : "não",
         l.createdAt.toISOString()].join(",")
      );
      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="obrardar-leads-${Date.now()}.csv"`,
        },
      });
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, nome: true, whatsapp: true, email: true,
          perfil: true, tipoObra: true, cidade: true,
          atividadeNome: true, severidade: true, desvio: true,
          rupReal: true, rupRef: true, hhTotal: true,
          pago: true, valor: true, metodoPagamento: true, createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[admin/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE — apaga leads por IDs (bulk)
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids obrigatório (array)" }, { status: 400 });
    }

    const result = await prisma.lead.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("[admin/leads DELETE]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
