import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcularRUP, atividades } from "@/lib/rup";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nome, email, whatsapp, cidade, perfil, tipoObra, atividadeId, quantidade, trabalhadores, horasPorDia, dias, custoHora, valor } = body;

  const at = atividades.find(a => a.id === atividadeId);
  if (!at) return NextResponse.json({ error: "Atividade inválida" }, { status: 400 });

  const rup = calcularRUP({
    atividadeId,
    quantidade: Number(quantidade),
    trabalhadores: Number(trabalhadores),
    horasPorDia: Number(horasPorDia),
    dias: Number(dias),
    custoHora: custoHora ? Number(custoHora) : null,
  });

  const lead = await prisma.lead.create({
    data: {
      nome, email: email || null, whatsapp: whatsapp ?? "",
      cidade: cidade || null, perfil: perfil || null, tipoObra: tipoObra || null,
      atividadeId, atividadeNome: at.nome, unidade: at.unidade,
      quantidade: Number(quantidade), trabalhadores: Number(trabalhadores),
      horasPorDia: Number(horasPorDia), dias: Number(dias),
      custoHora: custoHora ? Number(custoHora) : null,
      hhTotal: rup.hhTotal, rupReal: rup.rupReal,
      rupRef: rup.rupRef, desvio: rup.desvio,
      severidade: rup.severidade,
      pago: true,
      valor: Number(valor ?? 39.9),
    },
  });

  return NextResponse.json({ ok: true, id: lead.id, severidade: rup.severidade, atividadeNome: at.nome });
}
