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
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const format = req.nextUrl.searchParams.get("format");
    if (format === "csv") {
      const header = "id,nome,whatsapp,email,atividadeNome,severidade,desvio,rupReal,pago,createdAt";
      const rows = leads.map((l: Lead) =>
        [l.id, l.nome, l.whatsapp, l.email ?? "", l.atividadeNome, l.severidade,
         l.desvio.toFixed(2), l.rupReal.toFixed(3), l.pago ? "sim" : "não",
         l.createdAt.toISOString()].join(",")
      );
      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(leads);
  } catch (err) {
    console.error("[admin/leads]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
