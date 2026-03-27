/*
  Warnings:

  - You are about to drop the column `enderecoId` on the `PedidoManual` table. All the data in the column will be lost.
  - Added the required column `enderecoCliente` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PedidoManual" DROP CONSTRAINT "PedidoManual_enderecoId_fkey";

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "enderecoId",
ADD COLUMN     "data de criacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enderecoCliente" TEXT NOT NULL;
