/**
 * One-time (idempotent) backfill: encrypt existing plaintext PII rows and populate the
 * phone/email search hashes. Safe to re-run — a field that already decrypts is left as-is.
 *
 *   cd packages/database && node --env-file=.env ../../node_modules/tsx/dist/cli.mjs scripts/backfill-encrypt-pii.ts
 */
import { prisma } from "../client";
import { decryptField, encryptField } from "../lib/crypto-column";
import { computeEmailHash, computePhoneHash } from "../lib/pii";

const LEAD_FIELDS = ["patientName", "phone", "email", "reasonForVisit", "symptoms", "transcript", "conversationSummary"];
const CONVERSATION_FIELDS = ["transcript", "summary", "recordingUrl"];

function tryDecrypt(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  try {
    return decryptField(value);
  } catch {
    return value; // already plaintext
  }
}

function ensureEncrypted(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  try {
    decryptField(value);
    return value; // already ciphertext
  } catch {
    return encryptField(value);
  }
}

async function main() {
  const leads = await prisma.patientLead.findMany();
  for (const lead of leads) {
    const row = lead as unknown as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const field of LEAD_FIELDS) {
      const next = ensureEncrypted(row[field]);
      if (next !== undefined) data[field] = next;
    }
    const plainPhone = tryDecrypt(row.phone);
    if (plainPhone) data.phoneHash = computePhoneHash(plainPhone);
    const plainEmail = tryDecrypt(row.email);
    if (plainEmail) data.emailHash = computeEmailHash(plainEmail);
    await prisma.patientLead.update({ where: { id: lead.id }, data });
  }

  const conversations = await prisma.conversationLog.findMany();
  for (const conversation of conversations) {
    const row = conversation as unknown as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const field of CONVERSATION_FIELDS) {
      const next = ensureEncrypted(row[field]);
      if (next !== undefined) data[field] = next;
    }
    if (Object.keys(data).length > 0) {
      await prisma.conversationLog.update({ where: { id: conversation.id }, data });
    }
  }

  console.log(`Backfilled ${leads.length} leads and ${conversations.length} conversations.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
