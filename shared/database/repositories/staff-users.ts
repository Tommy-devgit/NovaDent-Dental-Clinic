import { prisma } from "../client";

export const staffUsersRepository = {
  findByEmail(email: string) {
    return prisma.staffUser.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.staffUser.findUnique({ where: { id } });
  },

  updateLastLogin(id: string) {
    return prisma.staffUser.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },

  listActiveStaff() {
    return prisma.staffUser.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ role: "asc" }, { firstName: "asc" }],
    });
  },
};