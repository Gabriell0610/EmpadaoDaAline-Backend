/*
  Warnings:

  - You are about to drop the column `descricao` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `itens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "itens" DROP COLUMN "descricao",
DROP COLUMN "image",
DROP COLUMN "nome",
DROP COLUMN "tipo",
ADD COLUMN     "itemDescriptionId" TEXT;

-- CreateTable
CREATE TABLE "ItemDescription" (
    "id" TEXT NOT NULL,
    "descricao" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,
    "nome" VARCHAR NOT NULL,

    CONSTRAINT "ItemDescription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_itemDescriptionId_fkey" FOREIGN KEY ("itemDescriptionId") REFERENCES "ItemDescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
