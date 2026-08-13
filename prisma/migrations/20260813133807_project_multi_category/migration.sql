-- Converte Project.category da stringa singola (spesso già più valori uniti con " · ")
-- ad array vero, per permettere di assegnare più categorie a un progetto.

-- AlterTable: aggiunge la nuova colonna array
ALTER TABLE "Project" ADD COLUMN "category_new" TEXT[] NOT NULL DEFAULT '{}';

-- Backfill: spacca i valori esistenti su " · " (il separatore già in uso per le categorie multiple)
UPDATE "Project"
SET "category_new" = string_to_array("category", ' · ')
WHERE "category" IS NOT NULL AND "category" <> '';

-- Sostituisce la vecchia colonna con quella nuova
ALTER TABLE "Project" DROP COLUMN "category";
ALTER TABLE "Project" RENAME COLUMN "category_new" TO "category";
