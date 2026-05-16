import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? req.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

// GET — lista todos os pacotes
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const pacotes = await prisma.pacote.findMany({
    orderBy: { createdAt: "desc" },
  });

  const agora = new Date();
  const enriched = pacotes.map(p => ({
    ...p,
    restantes: p.total - p.usado,
    expirado: p.expiraEm < agora,
    diasRestantes: Math.max(0, Math.ceil((p.expiraEm.getTime() - agora.getTime()) / 86400000)),
  }));

  return NextResponse.json({ pacotes: enriched, total: pacotes.length });
}

// POST — cria pacote manualmente (admin / simulação de compra)
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { email, total = 10, usado = 1, leadId } = await req.json();
  if (!email) return NextResponse.json({ error: "email obrigatório" }, { status: 400 });

  const expiraEm = new Date();
  expiraEm.setDate(expiraEm.getDate() + 30);

  const pacote = await prisma.pacote.create({
    data: { email: email.toLowerCase(), total, usado, ativo: true, leadId: leadId ?? null, expiraEm },
  });

  return NextResponse.json({ ok: true, pacote });
}
