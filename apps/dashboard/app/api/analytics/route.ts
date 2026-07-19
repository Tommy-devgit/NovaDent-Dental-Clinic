import { NextResponse } from "next/server";

import { analyticsRepository } from "@novadent/database";

const ALLOWED_RANGES = new Set([7, 30, 90]);

export async function GET(request: Request) {
  const raw = Number(new URL(request.url).searchParams.get("range"));
  const days = ALLOWED_RANGES.has(raw) ? raw : 30;
  const data = await analyticsRepository.getAnalytics({ days });
  return NextResponse.json(data);
}
