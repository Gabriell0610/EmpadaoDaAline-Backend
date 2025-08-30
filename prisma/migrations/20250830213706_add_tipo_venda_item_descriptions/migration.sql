/*
  Warnings:

  - You are about to drop the column `tipo` on the `ItemDescription` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('ITEM_BRUTO', 'POR_UNIDADE');

-- AlterTable
ALTER TABLE "ItemDescription" DROP COLUMN "tipo",
ADD COLUMN     "tipoVenda" "SaleType";

-- DropEnum
DROP TYPE "FoodType";

-- DropEnum
DROP TYPE "TypeItem";
