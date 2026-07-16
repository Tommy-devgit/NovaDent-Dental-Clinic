import { NextResponse } from "next/server";

import { clinicSettingsRepository } from "../../../../../shared/database";
import { clinicSettingsUpsertSchema } from "../../../../../shared/validations/clinic-setting";

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

  const settings = await clinicSettingsRepository.upsertSettings(parsed.data);
  return NextResponse.json({ settings });
}
