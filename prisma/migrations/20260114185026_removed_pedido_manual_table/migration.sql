/*
  Warnings:

  - You are about to drop the `PedidoManual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PedidoManualItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PedidoManual" DROP CONSTRAINT "PedidoManual_metodoPagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_pedidoManualId_fkey";

-- DropTable
DROP TABLE "PedidoManual";

-- DropTable
DROP TABLE "PedidoManualItem";
