import { PrismaNeon } from "@prisma/adapter-neon";

import { getRequiredEnvVar } from "@novadent/utils";

import { PrismaClient } from "./generated/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: getRequiredEnvVar("DATABASE_URL") });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}