import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  // Plain process.env access (not the `env()` helper) so `prisma generate` — which
  // doesn't need a live connection — still works during install/build even before
  // DATABASE_URL is available (e.g. a fresh Vercel build step).
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    seed: "tsx --env-file=.env prisma/seed.ts",
  },
});
