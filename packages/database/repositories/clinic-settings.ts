import { prisma } from "../client";
import { Prisma } from "../generated/client";

export const clinicSettingsRepository = {
  getSettings() {
    return prisma.clinicSetting.findUnique({
      where: { slug: "default" },
    });
  },

  upsertSettings(input: {
    clinicName: string;
    address: string;
    phone: string;
    email: string;
    timezone?: string;
    workingHours: Record<string, unknown>;
    vapiConfig: Record<string, unknown>;
    notificationSettings: Record<string, unknown>;
    updatedByStaffUserId?: string;
  }) {
    return prisma.clinicSetting.upsert({
      where: { slug: "default" },
      create: {
        slug: "default",
        clinicName: input.clinicName,
        address: input.address,
        phone: input.phone,
        email: input.email,
        timezone: input.timezone ?? "UTC",
        workingHours: input.workingHours as Prisma.InputJsonValue,
        vapiConfig: input.vapiConfig as Prisma.InputJsonValue,
        notificationSettings: input.notificationSettings as Prisma.InputJsonValue,
        updatedByStaffUserId: input.updatedByStaffUserId,
      },
      update: {
        clinicName: input.clinicName,
        address: input.address,
        phone: input.phone,
        email: input.email,
        timezone: input.timezone ?? "UTC",
        workingHours: input.workingHours as Prisma.InputJsonValue,
        vapiConfig: input.vapiConfig as Prisma.InputJsonValue,
        notificationSettings: input.notificationSettings as Prisma.InputJsonValue,
        updatedByStaffUserId: input.updatedByStaffUserId,
      },
    });
  },
};