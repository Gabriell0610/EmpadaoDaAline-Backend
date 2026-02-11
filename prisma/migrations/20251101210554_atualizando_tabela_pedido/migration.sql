/*
  Warnings:

  - You are about to drop the column `metodoPagamentoId` on the `pedidos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pedidoId]` on the table `MetodoPagamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pedidoManualId]` on the table `MetodoPagamento` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MetodoPagamento" DROP CONSTRAINT "MetodoPagamento_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "MetodoPagamento" DROP CONSTRAINT "MetodoPagamento_pedidoManualId_fkey";

-- AlterTable
ALTER TABLE "MetodoPagamento" ALTER COLUMN "pedidoId" DROP NOT NULL,
ALTER COLUMN "pedidoManualId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "metodoPagamentoId";

-- CreateIndex
CREATE UNIQUE INDEX "MetodoPagamento_pedidoId_key" ON "MetodoPagamento"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "MetodoPagamento_pedidoManualId_key" ON "MetodoPagamento"("pedidoManualId");

-- AddForeignKey
ALTER TABLE "MetodoPagamento" ADD CONSTRAINT "MetodoPagamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetodoPagamento" ADD CONSTRAINT "MetodoPagamento_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE SET NULL ON UPDATE CASCADE;
