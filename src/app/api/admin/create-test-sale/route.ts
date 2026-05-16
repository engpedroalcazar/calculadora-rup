import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcularRUP, corSeveridade } from "@/lib/rup";
import Decimal from "decimal.js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nome, email, whatsapp, cidade, perfil, tipoObra, atividadeId, atividadeNome, unidade, quantidade, trabalhadores, horasPorDia, dias, custoHora, valor } = body;

  const rup = calcularRUP({ atividadeId, quantidade, trabalhadores, horasPorDia, dias, custoHora });

  const lead = await prisma.lead.create({
    data: {
      nome, email, whatsapp: whatsapp ?? "", cidade: cidade ?? "",
      perfil: perfil ?? "", tipoObra: tipoObra ?? "",
      atividadeId, atividadeNome, unidade,
      quantidade: new Decimal(quantidade),
      trabalhadores, horasPorDia: new Decimal(horasPorDia),
      dias, custoHora: custoHora ? new Decimal(custoHora) : null,
      rupReal: new Decimal(rup.rupReal), rupRef: new Decimal(rup.rupRef),
      hhTotal: new Decimal(rup.hhTotal), desvio: new Decimal(rup.desvio),
      severidade: rup.severidade,
      pago: true,
      valor: new Decimal(valor ?? 39.9),
    },
  });

  return NextResponse.json({ ok: true, id: lead.id, severidade: rup.severidade });
}
