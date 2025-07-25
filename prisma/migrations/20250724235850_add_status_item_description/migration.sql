/*
  Warnings:

  - You are about to drop the column `disponivel` on the `itens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemDescription" ADD COLUMN     "disponivel" "statusItem";

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "disponivel";
