import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcularRUP, atividades } from "@/lib/rup";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      atividadeId, quantidade, trabalhadores, horasPorDia, dias, custoHora,
      cidade, nome, whatsapp, email,
      perfil, tipoObra, preocupacao, controle,
    } = body;

    if (!atividadeId || !quantidade || !trabalhadores || !horasPorDia || !dias || !nome || !whatsapp || !email) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const nums = {
      quantidade: Number(quantidade),
      trabalhadores: Number(trabalhadores),
      horasPorDia: Number(horasPorDia),
      dias: Number(dias),
    };
    if (Object.values(nums).some((n) => isNaN(n) || n <= 0)) {
      return NextResponse.json({ error: "Valores numéricos inválidos" }, { status: 400 });
    }
    if (custoHora != null && (isNaN(Number(custoHora)) || Number(custoHora) < 0)) {
      return NextResponse.json({ error: "Custo por hora inválido" }, { status: 400 });
    }

    const at = atividades.find((a) => a.id === atividadeId);
    if (!at) {
      return NextResponse.json({ error: "Atividade inválida" }, { status: 400 });
    }

    const resultado = calcularRUP({
      ...nums,
      custoHora: custoHora ? Number(custoHora) : null,
      atividadeId,
    });

    const lead = await prisma.lead.create({
      data: {
        nome, whatsapp, email: email || null,
        perfil: perfil || null, tipoObra: tipoObra || null,
        preocupacao: preocupacao || null, controle: controle || null,
        cidade: cidade || null,
        atividadeId,
        atividadeNome: at.nome,
        unidade: at.unidade,
        ...nums,
        custoHora: custoHora ? Number(custoHora) : null,
        hhTotal: resultado.hhTotal,
        rupReal: resultado.rupReal,
        rupRef: resultado.rupRef,
        desvio: resultado.desvio,
        severidade: resultado.severidade,
      },
    });

    return NextResponse.json({
      id: lead.id,
      severidade: resultado.severidade,
      desvio: resultado.desvio,
      rupReal: resultado.rupReal,
      rupRef: resultado.rupRef,
      hhTotal: resultado.hhTotal,
      atividadeNome: at.nome,
      unidade: at.unidade,
    });
  } catch (err) {
    console.error("[calcular]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
