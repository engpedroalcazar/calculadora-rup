import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcularRUP } from "@/lib/rup";
import { gerarDiagnostico } from "@/lib/diagnostico";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

    const resultado = calcularRUP({
      atividadeId: lead.atividadeId,
      quantidade: lead.quantidade,
      trabalhadores: lead.trabalhadores,
      horasPorDia: lead.horasPorDia,
      dias: lead.dias,
      custoHora: lead.custoHora,
    });

    const diagnostico = gerarDiagnostico(lead.atividadeId, resultado);

    return NextResponse.json({ lead, resultado, diagnostico });
  } catch (err) {
    console.error("[relatorio]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
