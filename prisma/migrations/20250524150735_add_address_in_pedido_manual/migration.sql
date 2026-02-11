/*
  Warnings:

  - Added the required column `enderecoId` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PedidoManual" ADD COLUMN     "enderecoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PedidoManual" ADD CONSTRAINT "PedidoManual_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
