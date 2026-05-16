import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcularRUP } from "@/lib/rup";
import { gerarDiagnostico } from "@/lib/diagnostico";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

    // Segurança: só entrega dados de laudo se pago, ou se for admin
    const adminToken = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
    const isAdmin = adminToken === process.env.ADMIN_TOKEN;
    if (!lead.pago && !isAdmin) {
      return NextResponse.json({ error: "Pagamento necessário", leadId: id }, { status: 402 });
    }

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
