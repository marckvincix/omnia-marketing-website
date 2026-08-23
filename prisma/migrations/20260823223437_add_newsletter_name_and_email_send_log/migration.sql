-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "EmailSendLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSendLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailSendLog_createdAt_idx" ON "EmailSendLog"("createdAt");

