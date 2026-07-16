-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'RECEPTIONIST');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'BOOKED', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ConversationProvider" AS ENUM ('VAPI', 'N8N');

-- CreateTable
CREATE TABLE "staff_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'RECEPTIONIST',
    "status" "StaffStatus" NOT NULL DEFAULT 'INVITED',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_leads" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "reasonForVisit" TEXT NOT NULL,
    "symptoms" TEXT,
    "urgency" "LeadUrgency" NOT NULL DEFAULT 'LOW',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "conversationSummary" TEXT,
    "transcript" TEXT,
    "source" TEXT NOT NULL DEFAULT 'vapi',
    "vapiConversationId" TEXT,
    "n8nExecutionId" TEXT,
    "appointmentRequestedAt" TIMESTAMP(3),
    "assignedStaffUserId" TEXT,
    "updatedByStaffUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "location" TEXT,
    "externalCalendarEventId" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdByStaffUserId" TEXT,
    "updatedByStaffUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_logs" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "provider" "ConversationProvider" NOT NULL DEFAULT 'VAPI',
    "externalConversationId" TEXT NOT NULL,
    "summary" TEXT,
    "transcript" TEXT NOT NULL,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_settings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT 'default',
    "clinicName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "workingHours" JSONB NOT NULL,
    "vapiConfig" JSONB NOT NULL,
    "notificationSettings" JSONB NOT NULL,
    "updatedByStaffUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

-- CreateIndex
CREATE INDEX "staff_users_role_idx" ON "staff_users"("role");

-- CreateIndex
CREATE INDEX "staff_users_status_idx" ON "staff_users"("status");

-- CreateIndex
CREATE INDEX "staff_users_email_idx" ON "staff_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_leads_vapiConversationId_key" ON "patient_leads"("vapiConversationId");

-- CreateIndex
CREATE INDEX "patient_leads_status_idx" ON "patient_leads"("status");

-- CreateIndex
CREATE INDEX "patient_leads_urgency_idx" ON "patient_leads"("urgency");

-- CreateIndex
CREATE INDEX "patient_leads_phone_idx" ON "patient_leads"("phone");

-- CreateIndex
CREATE INDEX "patient_leads_email_idx" ON "patient_leads"("email");

-- CreateIndex
CREATE INDEX "patient_leads_createdAt_idx" ON "patient_leads"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_externalCalendarEventId_key" ON "appointments"("externalCalendarEventId");

-- CreateIndex
CREATE INDEX "appointments_leadId_idx" ON "appointments"("leadId");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "appointments_scheduledFor_idx" ON "appointments"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_logs_externalConversationId_key" ON "conversation_logs"("externalConversationId");

-- CreateIndex
CREATE INDEX "conversation_logs_leadId_idx" ON "conversation_logs"("leadId");

-- CreateIndex
CREATE INDEX "conversation_logs_provider_idx" ON "conversation_logs"("provider");

-- CreateIndex
CREATE INDEX "conversation_logs_startedAt_idx" ON "conversation_logs"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_settings_slug_key" ON "clinic_settings"("slug");

-- AddForeignKey
ALTER TABLE "patient_leads" ADD CONSTRAINT "patient_leads_assignedStaffUserId_fkey" FOREIGN KEY ("assignedStaffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_leads" ADD CONSTRAINT "patient_leads_updatedByStaffUserId_fkey" FOREIGN KEY ("updatedByStaffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "patient_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_createdByStaffUserId_fkey" FOREIGN KEY ("createdByStaffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_updatedByStaffUserId_fkey" FOREIGN KEY ("updatedByStaffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_logs" ADD CONSTRAINT "conversation_logs_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "patient_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_settings" ADD CONSTRAINT "clinic_settings_updatedByStaffUserId_fkey" FOREIGN KEY ("updatedByStaffUserId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
