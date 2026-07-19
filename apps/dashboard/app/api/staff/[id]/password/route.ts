import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, staffUsersRepository } from "@novadent/database";
import { staffPasswordSchema } from "@novadent/validations";

import { hashStaffPassword } from "@/lib/auth";
import { toApiError } from "@/lib/api-errors";
import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = staffPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const target = await staffUsersRepository.findById(id);
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await staffUsersRepository.setStaffPassword(id, await hashStaffPassword(parsed.data.password));
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "STAFF_PASSWORD_RESET",
      resourceType: "StaffUser",
      resourceId: id,
      staffUserId: session?.id,
    })
    .catch(() => undefined);

  return NextResponse.json({ ok: true });
}
