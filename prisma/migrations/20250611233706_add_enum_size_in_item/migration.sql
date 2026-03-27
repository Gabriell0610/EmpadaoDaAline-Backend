-- CreateEnum
CREATE TYPE "ItemSize" AS ENUM ('P', 'M', 'G', 'GG');

-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "tamanho" "ItemSize";
