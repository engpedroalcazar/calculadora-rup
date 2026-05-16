import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      return new PrismaPg(pool);
    },
  },
});
