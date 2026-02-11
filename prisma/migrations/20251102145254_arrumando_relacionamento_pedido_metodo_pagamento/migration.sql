/*
  Warnings:

  - You are about to drop the column `pedidoId` on the `MetodoPagamento` table. All the data in the column will be lost.
  - You are about to drop the column `pedidoManualId` on the `MetodoPagamento` table. All the data in the column will be lost.
  - Added the required column `metodoPagamentoId` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodoPagamentoId` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MetodoPagamento" DROP CONSTRAINT "MetodoPagamento_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "MetodoPagamento" DROP CONSTRAINT "MetodoPagamento_pedidoManualId_fkey";

-- DropIndex
DROP INDEX "MetodoPagamento_pedidoId_key";

-- DropIndex
DROP INDEX "MetodoPagamento_pedidoManualId_key";

-- AlterTable
ALTER TABLE "MetodoPagamento" DROP COLUMN "pedidoId",
DROP COLUMN "pedidoManualId";

-- AlterTable
ALTER TABLE "PedidoManual" ADD COLUMN     "metodoPagamentoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "metodoPagamentoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_metodoPagamentoId_fkey" FOREIGN KEY ("metodoPagamentoId") REFERENCES "MetodoPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManual" ADD CONSTRAINT "PedidoManual_metodoPagamentoId_fkey" FOREIGN KEY ("metodoPagamentoId") REFERENCES "MetodoPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
