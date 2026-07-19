import { NextResponse } from "next/server";

import { activityLogsRepository, staffUsersRepository } from "@novadent/database";
import { staffCreateSchema } from "@novadent/validations";

import { hashStaffPassword } from "@/lib/auth";
import { toApiError } from "@/lib/api-errors";
import { getStaffSessionFromCookies } from "@/lib/session";

export async function GET() {
  const staff = await staffUsersRepository.listStaff();
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = staffCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const { password, ...rest } = parsed.data;

  let staff;
  try {
    staff = await staffUsersRepository.createStaff({
      ...rest,
      passwordHash: await hashStaffPassword(password),
      status: "ACTIVE",
    });
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "STAFF_CREATED",
      resourceType: "StaffUser",
      resourceId: staff.id,
      staffUserId: session?.id,
      metadata: { role: staff.role },
    })
    .catch(() => undefined);

  return NextResponse.json({ staff }, { status: 201 });
}
