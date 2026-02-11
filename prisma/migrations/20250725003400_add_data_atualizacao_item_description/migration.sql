/*
  Warnings:

  - You are about to drop the column `data de criacao` on the `itens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemDescription" ADD COLUMN     "data de atualizacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data de criacao" DATE DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "data de criacao";
