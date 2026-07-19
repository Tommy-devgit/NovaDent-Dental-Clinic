import { decryptField, encryptField, hashForSearch } from "./crypto-column";

const LEAD_ENCRYPTED_FIELDS = [
  "patientName",
  "phone",
  "email",
  "reasonForVisit",
  "symptoms",
  "transcript",
  "conversationSummary",
] as const;

const CONVERSATION_ENCRYPTED_FIELDS = ["transcript", "summary", "recordingUrl"] as const;

/** Canonical UK phone form for hashing: last 10 significant digits (07…/+447… collapse equal). */
export function computePhoneHash(phone: string): string {
  return hashForSearch(phone.replace(/\D/g, "").slice(-10));
}

export function computeEmailHash(email: string): string {
  return hashForSearch(email);
}

function encryptValue(value: unknown): unknown {
  return typeof value === "string" && value.length > 0 ? encryptField(value) : value;
}

// Tolerant: legacy plaintext (or already-decrypted) values that aren't valid ciphertext
// pass through unchanged instead of throwing, so reads survive a partial backfill.
function decryptValue(value: unknown): unknown {
  if (typeof value !== "string" || value.length === 0) return value;
  try {
    return decryptField(value);
  } catch {
    return value;
  }
}

/** Encrypt lead PII fields in place (on a copy) and derive phone/email search hashes. */
export function encryptLeadWrite<T extends Record<string, unknown>>(
  data: T,
): T & { phoneHash?: string; emailHash?: string } {
  const out: Record<string, unknown> = { ...data };
  for (const field of LEAD_ENCRYPTED_FIELDS) {
    if (field in out) out[field] = encryptValue(out[field]);
  }
  if (typeof data.phone === "string" && data.phone.length > 0) out.phoneHash = computePhoneHash(data.phone);
  if (typeof data.email === "string" && data.email.length > 0) out.emailHash = computeEmailHash(data.email);
  return out as T & { phoneHash?: string; emailHash?: string };
}

export function encryptConversationWrite<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = { ...data };
  for (const field of CONVERSATION_ENCRYPTED_FIELDS) {
    if (field in out) out[field] = encryptValue(out[field]);
  }
  return out as T;
}

export function decryptConversationRow<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = { ...row };
  for (const field of CONVERSATION_ENCRYPTED_FIELDS) {
    if (field in out) out[field] = decryptValue(out[field]);
  }
  return out as T;
}

/** Decrypt lead PII fields (and any nested conversationLogs) for a fetched row. */
export function decryptLeadRow<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = { ...row };
  for (const field of LEAD_ENCRYPTED_FIELDS) {
    if (field in out) out[field] = decryptValue(out[field]);
  }
  if (Array.isArray(out.conversationLogs)) {
    out.conversationLogs = out.conversationLogs.map((log) =>
      log && typeof log === "object" ? decryptConversationRow(log as Record<string, unknown>) : log,
    );
  }
  return out as T;
}
