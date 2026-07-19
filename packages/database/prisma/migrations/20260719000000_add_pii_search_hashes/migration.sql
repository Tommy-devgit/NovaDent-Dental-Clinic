-- Add HMAC search-hash columns for encrypted phone/email, and index those instead of
-- the (now ciphertext) plaintext columns. Deliberately does NOT touch n8n_chat_histories,
-- which is managed by the external n8n chat workflow and not part of the Prisma schema.

-- DropIndex
DROP INDEX "patient_leads_email_idx";

-- DropIndex
DROP INDEX "patient_leads_phone_idx";

-- AlterTable
ALTER TABLE "patient_leads" ADD COLUMN     "emailHash" TEXT,
ADD COLUMN     "phoneHash" TEXT;

-- CreateIndex
CREATE INDEX "patient_leads_phoneHash_idx" ON "patient_leads"("phoneHash");

-- CreateIndex
CREATE INDEX "patient_leads_emailHash_idx" ON "patient_leads"("emailHash");
