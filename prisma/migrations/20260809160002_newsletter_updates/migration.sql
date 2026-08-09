-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "unsubscribeToken" TEXT;
UPDATE "NewsletterSubscriber" SET "unsubscribeToken" = gen_random_uuid()::text WHERE "unsubscribeToken" IS NULL;
ALTER TABLE "NewsletterSubscriber" ALTER COLUMN "unsubscribeToken" SET NOT NULL;
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "newsletterSentAt" TIMESTAMP(3);
