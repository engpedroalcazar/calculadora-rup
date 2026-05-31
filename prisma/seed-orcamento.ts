// Seed do banco Postgres a partir dos arquivos-fonte em src/data/orcamento/.
// Rodar com: npm run seed:orcamento
// (ou: DATABASE_URL=... npx tsx prisma/seed-orcamento.ts)
//
// Pode ser executado várias vezes — usa upsert (cria ou atualiza por código).
// Em dev local aponta pro Docker (via .env.local). Em prod (Iter #6) apontará pro Supabase.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { INSUMOS } from "../src/data/orcamento/insumos";
import { ATIVIDADE_INSUMOS } from "../src/data/orcamento/atividade-insumos";

// Carrega .env.local primeiro (sobrescreve .env quando existir).
// Em produção (Vercel), nenhum desses existe e DATABASE_URL vem do painel.
config({ path: ".env.local" });
config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("✗ DATABASE_URL não definida. Crie .env.local ou exporte a variável.");
  process.exit(1);
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("→ Sincronizando insumos…");
  let insumosCriados = 0;
  let insumosAtualizados = 0;

  for (const insumo of INSUMOS) {
    const existente = await prisma.insumo.findUnique({ where: { codigo: insumo.codigo } });
    await prisma.insumo.upsert({
      where: { codigo: insumo.codigo },
      update: {
        descricao: insumo.descricao,
        unidade: insumo.unidade,
        custoUnitarioMedio: insumo.custoUnitarioMedio,
        codigoSinapi: insumo.codigoSinapi ?? null,
        fonte: insumo.fonte,
      },
      create: {
        codigo: insumo.codigo,
        descricao: insumo.descricao,
        unidade: insumo.unidade,
        custoUnitarioMedio: insumo.custoUnitarioMedio,
        codigoSinapi: insumo.codigoSinapi ?? null,
        fonte: insumo.fonte,
      },
    });
    if (existente) insumosAtualizados++;
    else insumosCriados++;
  }
  console.log(`  ✓ ${insumosCriados} criados, ${insumosAtualizados} atualizados (total: ${INSUMOS.length})`);

  console.log("→ Sincronizando vínculos atividade-insumo…");
  let vinculosCriados = 0;
  let vinculosAtualizados = 0;
  const codigosFaltando: string[] = [];

  for (const link of ATIVIDADE_INSUMOS) {
    const insumo = await prisma.insumo.findUnique({ where: { codigo: link.insumoCodigo } });
    if (!insumo) {
      codigosFaltando.push(link.insumoCodigo);
      continue;
    }
    const existente = await prisma.atividadeInsumo.findUnique({
      where: { atividadeId_insumoId: { atividadeId: link.atividadeId, insumoId: insumo.id } },
    });
    await prisma.atividadeInsumo.upsert({
      where: { atividadeId_insumoId: { atividadeId: link.atividadeId, insumoId: insumo.id } },
      update: {
        qtdePorUnidade: link.qtdePorUnidade,
        fatorPerda: link.fatorPerda,
        observacao: link.observacao ?? null,
      },
      create: {
        atividadeId: link.atividadeId,
        insumoId: insumo.id,
        qtdePorUnidade: link.qtdePorUnidade,
        fatorPerda: link.fatorPerda,
        observacao: link.observacao ?? null,
      },
    });
    if (existente) vinculosAtualizados++;
    else vinculosCriados++;
  }
  console.log(`  ✓ ${vinculosCriados} criados, ${vinculosAtualizados} atualizados (total: ${ATIVIDADE_INSUMOS.length})`);

  if (codigosFaltando.length > 0) {
    console.error(`  ⚠ Códigos de insumo referenciados mas não cadastrados:`);
    for (const c of codigosFaltando) console.error(`    - ${c}`);
    process.exit(1);
  }

  const atividadesComLink = new Set(ATIVIDADE_INSUMOS.map((a) => a.atividadeId));
  console.log(`→ Resumo: ${atividadesComLink.size} atividades cobertas com insumos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
