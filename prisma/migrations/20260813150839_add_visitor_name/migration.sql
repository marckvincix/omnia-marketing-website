-- CreateTable
CREATE TABLE "VisitorName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visitorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorName_visitorId_key" ON "VisitorName"("visitorId");
