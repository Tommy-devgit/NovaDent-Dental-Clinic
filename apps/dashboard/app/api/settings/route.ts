import { NextResponse } from "next/server";

import { clinicSettingsRepository } from "@novadent/database";
import { clinicSettingsUpsertSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";
import { toApiError } from "@/lib/api-errors";

export async function GET() {
  const settings = await clinicSettingsRepository.getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = clinicSettingsUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();

  let settings;
  try {
    settings = await clinicSettingsRepository.upsertSettings({
      ...parsed.data,
      updatedByStaffUserId: session?.id,
    });
  } catch (error) {
    return toApiError(error);
  }
  return NextResponse.json({ settings });
}
