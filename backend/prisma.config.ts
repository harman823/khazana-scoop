import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env"), override: false });
dotenv.config({ path: path.resolve(__dirname, "..", ".env"), override: false });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
