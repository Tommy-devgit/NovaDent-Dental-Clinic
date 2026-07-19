import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

function getKey(): Buffer {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("Missing PII_ENCRYPTION_KEY environment variable");
  }
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    throw new Error("PII_ENCRYPTION_KEY must be 32 bytes encoded as 64 hex characters");
  }
  return key;
}

/** AES-256-GCM encrypt. Returns base64(iv | authTag | ciphertext). */
export function encryptField(plaintext: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

/** Reverse of encryptField. Throws if the auth tag fails (tampered data). */
export function decryptField(token: string): string {
  const buffer = Buffer.from(token, "base64");
  if (buffer.length < IV_BYTES + AUTH_TAG_BYTES + 1) {
    throw new Error("Ciphertext too short to be valid");
  }
  const iv = buffer.subarray(0, IV_BYTES);
  const authTag = buffer.subarray(IV_BYTES, IV_BYTES + AUTH_TAG_BYTES);
  const ciphertext = buffer.subarray(IV_BYTES + AUTH_TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext, undefined, "utf8") + decipher.final("utf8");
}

/**
 * Deterministic HMAC-SHA256 hex digest for exact-match lookups on encrypted columns
 * (ciphertext is not searchable). Normalizes case/whitespace so equal values hash equal.
 */
export function hashForSearch(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHmac("sha256", getKey()).update(normalized).digest("hex");
}
