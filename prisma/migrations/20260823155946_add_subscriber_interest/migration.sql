-- CreateTable
CREATE TABLE "SubscriberInterest" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "lastClickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriberInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriberInterest_subscriberId_categoryId_key" ON "SubscriberInterest"("subscriberId", "categoryId");

-- AddForeignKey
ALTER TABLE "SubscriberInterest" ADD CONSTRAINT "SubscriberInterest_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriberInterest" ADD CONSTRAINT "SubscriberInterest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
