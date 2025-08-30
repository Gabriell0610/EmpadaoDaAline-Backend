/*
  Warnings:

  - You are about to drop the column `tipoVenda` on the `ItemDescription` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeItem" AS ENUM ('EMPADAO', 'PANQUECA', 'ALMONDEGA');

-- AlterTable
ALTER TABLE "ItemDescription" DROP COLUMN "tipoVenda",
ADD COLUMN     "tipo" "TypeItem";

-- DropEnum
DROP TYPE "SaleType";
