-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('LEAD_CREATED', 'LEAD_UPDATED', 'CONVERSATION_STARTED', 'CONVERSATION_ENDED', 'APPOINTMENT_CREATED', 'APPOINTMENT_UPDATED', 'STATUS_CHANGED');

-- AlterTable
ALTER TABLE "conversation_logs" ADD COLUMN     "assistantId" TEXT,
ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "status" "ConversationStatus" NOT NULL DEFAULT 'COMPLETED';

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "staffUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_logs_resourceType_resourceId_idx" ON "activity_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "conversation_logs_status_idx" ON "conversation_logs"("status");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_staffUserId_fkey" FOREIGN KEY ("staffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
