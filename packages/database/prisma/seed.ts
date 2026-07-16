import bcrypt from "bcryptjs";

import { getRequiredEnvVar } from "@novadent/utils";

import { prisma } from "../client";

async function main() {
  const email = getRequiredEnvVar("SEED_ADMIN_EMAIL").toLowerCase();
  const password = getRequiredEnvVar("SEED_ADMIN_PASSWORD");
  const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || "Admin";
  const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || "User";

  const existing = await prisma.staffUser.findUnique({ where: { email } });

  if (existing) {
    console.log(`Staff user ${email} already exists, skipping seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.staffUser.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`Created ADMIN staff user: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
