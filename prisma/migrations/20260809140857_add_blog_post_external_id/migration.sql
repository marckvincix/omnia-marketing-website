-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_externalId_key" ON "BlogPost"("externalId");
