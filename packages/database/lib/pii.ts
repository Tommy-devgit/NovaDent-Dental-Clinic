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

const MIN_CIPHERTEXT_BYTES = 29; // 12-byte IV + 16-byte auth tag + at least 1 payload byte

function isCiphertextShaped(value: string): boolean {
  if (value.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return false;
  return Buffer.from(value, "base64").length >= MIN_CIPHERTEXT_BYTES;
}

// Tolerant only for legacy plaintext (partial backfill): non-base64 values pass through.
// A ciphertext-shaped value that fails to decrypt means PII_ENCRYPTION_KEY doesn't match
// the key that encrypted the row — throw instead of leaking ciphertext to the UI.
function decryptValue(value: unknown): unknown {
  if (typeof value !== "string" || value.length === 0) return value;
  try {
    return decryptField(value);
  } catch {
    if (isCiphertextShaped(value)) {
      throw new Error(
        "Failed to decrypt PII column: PII_ENCRYPTION_KEY does not match the key that encrypted this row",
      );
    }
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
