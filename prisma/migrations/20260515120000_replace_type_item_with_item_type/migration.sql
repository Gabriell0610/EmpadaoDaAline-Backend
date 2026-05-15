-- CreateTable
CREATE TABLE "item_types" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),

    CONSTRAINT "item_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_types_nome_key" ON "item_types"("nome");

-- AlterTable
ALTER TABLE "ItemDescription" ADD COLUMN "itemTypeId" TEXT;

-- Preserve old enum values as dynamic item types.
INSERT INTO "item_types" ("id", "nome", "createdAt", "updatedAt")
SELECT DISTINCT
    LOWER(
      CONCAT(
        SUBSTRING(MD5("tipo"::TEXT) FROM 1 FOR 8), '-',
        SUBSTRING(MD5("tipo"::TEXT) FROM 9 FOR 4), '-',
        SUBSTRING(MD5("tipo"::TEXT) FROM 13 FOR 4), '-',
        SUBSTRING(MD5("tipo"::TEXT) FROM 17 FOR 4), '-',
        SUBSTRING(MD5("tipo"::TEXT) FROM 21 FOR 12)
      )
    ) AS "id",
    "tipo"::TEXT AS "nome",
    CURRENT_TIMESTAMP AS "createdAt",
    CURRENT_TIMESTAMP AS "updatedAt"
FROM "ItemDescription"
WHERE "tipo" IS NOT NULL
ON CONFLICT ("nome") DO NOTHING;

-- Relate existing item descriptions to their new dynamic item types.
UPDATE "ItemDescription" AS description
SET "itemTypeId" = type."id"
FROM "item_types" AS type
WHERE description."tipo" IS NOT NULL
  AND type."nome" = description."tipo"::TEXT;

-- Drop old enum column and enum type.
ALTER TABLE "ItemDescription" DROP COLUMN "tipo";
DROP TYPE IF EXISTS "TypeItem";

-- AddForeignKey
ALTER TABLE "ItemDescription" ADD CONSTRAINT "ItemDescription_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "item_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
