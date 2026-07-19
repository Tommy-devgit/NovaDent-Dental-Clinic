import { NextResponse } from "next/server";

function isPrismaKnownError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

/** Map a thrown repository/Prisma error to an HTTP status + safe client message. */
export function classifyApiError(error: unknown): { status: number; message: string } {
  if (isPrismaKnownError(error)) {
    if (error.code === "P2025") return { status: 404, message: "Not found" };
    if (error.code === "P2003") return { status: 422, message: "Invalid reference" };
    if (error.code === "P2002") return { status: 409, message: "Already exists" };
  }
  return { status: 500, message: "Something went wrong" };
}

export function toApiError(error: unknown): NextResponse {
  const { status, message } = classifyApiError(error);
  return NextResponse.json({ error: message }, { status });
}
