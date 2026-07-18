-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "conversationLogId" TEXT;

-- AlterTable
ALTER TABLE "conversation_logs" ADD COLUMN     "recordingUrl" TEXT;

-- CreateIndex
CREATE INDEX "appointments_conversationLogId_idx" ON "appointments"("conversationLogId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_conversationLogId_fkey" FOREIGN KEY ("conversationLogId") REFERENCES "conversation_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
