-- AlterTable
ALTER TABLE "ProjectMedia" ADD COLUMN     "sectionId" TEXT;

-- CreateTable
CREATE TABLE "ProjectGallerySection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectGallerySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectGallerySectionTranslation" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectGallerySectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectGallerySectionTranslation_sectionId_locale_key" ON "ProjectGallerySectionTranslation"("sectionId", "locale");

-- AddForeignKey
ALTER TABLE "ProjectMedia" ADD CONSTRAINT "ProjectMedia_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ProjectGallerySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGallerySection" ADD CONSTRAINT "ProjectGallerySection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectGallerySectionTranslation" ADD CONSTRAINT "ProjectGallerySectionTranslation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ProjectGallerySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Tabelle nuove: senza RLS sarebbero leggibili/scrivibili da chiunque via PostgREST di
-- Supabase. Nessuna policy: Prisma si connette come owner e bypassa RLS.
ALTER TABLE "ProjectGallerySection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectGallerySectionTranslation" ENABLE ROW LEVEL SECURITY;
