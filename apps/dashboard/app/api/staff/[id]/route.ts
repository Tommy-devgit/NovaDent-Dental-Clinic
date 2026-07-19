import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, staffUsersRepository } from "@novadent/database";
import { staffUpdateSchema } from "@novadent/validations";

import { toApiError } from "@/lib/api-errors";
import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = staffUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const target = await staffUsersRepository.findById(id);
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { status, ...profile } = parsed.data;
  const demotingLastAdmin = profile.role && profile.role !== "ADMIN" && target.role === "ADMIN";
  const suspendingLastAdmin =
    status && status !== "ACTIVE" && target.status === "ACTIVE" && target.role === "ADMIN";

  if (demotingLastAdmin || suspendingLastAdmin) {
    const activeAdmins = await staffUsersRepository.countActiveAdmins();
    if (activeAdmins <= 1) {
      return NextResponse.json({ error: "Cannot remove the last active admin." }, { status: 409 });
    }
  }

  let staff;
  try {
    if (Object.keys(profile).length > 0) {
      staff = await staffUsersRepository.updateStaff(id, profile);
    }
    if (status) {
      staff = await staffUsersRepository.setStaffStatus(id, status);
    }
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: status ? "STAFF_STATUS_CHANGED" : "STAFF_UPDATED",
      resourceType: "StaffUser",
      resourceId: id,
      staffUserId: session?.id,
      metadata: { ...profile, ...(status ? { status } : {}) },
    })
    .catch(() => undefined);

  return NextResponse.json({ staff });
}
