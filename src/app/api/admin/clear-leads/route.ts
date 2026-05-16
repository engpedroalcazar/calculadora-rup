import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const before = await prisma.lead.count();
  await prisma.lead.deleteMany({});
  const after = await prisma.lead.count();
  return NextResponse.json({ deleted: before - after, remaining: after });
}
