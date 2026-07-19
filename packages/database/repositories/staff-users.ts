import { prisma } from "../client";

type StaffRole = "ADMIN" | "RECEPTIONIST";
type StaffStatus = "ACTIVE" | "INVITED" | "SUSPENDED";

const STAFF_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

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

  listStaff() {
    return prisma.staffUser.findMany({
      select: STAFF_SELECT,
      orderBy: [{ role: "asc" }, { firstName: "asc" }],
    });
  },

  createStaff(input: {
    email: string;
    firstName: string;
    lastName: string;
    role: StaffRole;
    passwordHash: string;
    status: StaffStatus;
  }) {
    return prisma.staffUser.create({ data: input, select: STAFF_SELECT });
  },

  updateStaff(id: string, data: { firstName?: string; lastName?: string; role?: StaffRole }) {
    return prisma.staffUser.update({ where: { id }, data, select: STAFF_SELECT });
  },

  setStaffStatus(id: string, status: StaffStatus) {
    return prisma.staffUser.update({ where: { id }, data: { status }, select: STAFF_SELECT });
  },

  setStaffPassword(id: string, passwordHash: string) {
    return prisma.staffUser.update({ where: { id }, data: { passwordHash }, select: { id: true } });
  },

  /** Active admins remaining — used to block removing/demoting/suspending the last one. */
  countActiveAdmins() {
    return prisma.staffUser.count({ where: { role: "ADMIN", status: "ACTIVE" } });
  },
};
