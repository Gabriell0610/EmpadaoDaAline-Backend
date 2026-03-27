/*
  Warnings:

  - Added the required column `status` to the `Carrinho` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusCart" AS ENUM ('ATIVO', 'INATIVO', 'FECHADO');

-- AlterTable
ALTER TABLE "Carrinho" ADD COLUMN     "status" "StatusCart" NOT NULL;
