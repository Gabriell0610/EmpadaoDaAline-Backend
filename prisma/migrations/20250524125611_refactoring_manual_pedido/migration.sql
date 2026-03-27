/*
  Warnings:

  - You are about to drop the column `bairro` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `PedidoManual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "bairro",
DROP COLUMN "cep",
DROP COLUMN "cidade",
DROP COLUMN "complemento",
DROP COLUMN "numero",
DROP COLUMN "rua",
ADD COLUMN     "enderecoId" TEXT;

-- AddForeignKey
ALTER TABLE "PedidoManual" ADD CONSTRAINT "PedidoManual_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
