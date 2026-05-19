import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // 1. Adiciona coluna metodoPagamento na tabela Lead
    await prisma.$executeRaw`
      ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "metodoPagamento" TEXT;
    `;
    results.push("✅ Lead.metodoPagamento adicionado");
  } catch (e: unknown) {
    results.push(`⚠️ Lead.metodoPagamento: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    // 2. Cria tabela Pacote
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Pacote" (
        "id"        TEXT NOT NULL,
        "email"     TEXT NOT NULL,
        "total"     INTEGER NOT NULL DEFAULT 10,
        "usado"     INTEGER NOT NULL DEFAULT 1,
        "ativo"     BOOLEAN NOT NULL DEFAULT true,
        "leadId"    TEXT,
        "expiraEm"  TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Pacote_pkey" PRIMARY KEY ("id")
      );
    `;
    results.push("✅ Tabela Pacote criada");
  } catch (e: unknown) {
    results.push(`⚠️ Tabela Pacote: ${e instanceof Error ? e.message : String(e)}`);
  }

  try {
    // 3. Índices da tabela Pacote
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Pacote_email_ativo_idx" ON "Pacote"("email", "ativo");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Pacote_expiraEm_idx" ON "Pacote"("expiraEm");`;
    results.push("✅ Índices Pacote criados");
  } catch (e: unknown) {
    results.push(`⚠️ Índices: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({ ok: true, results });
}
