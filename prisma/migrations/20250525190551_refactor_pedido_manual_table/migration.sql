/*
  Warnings:

  - Made the column `itemId` on table `PedidoManualItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pedidoManualId` on table `PedidoManualItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_pedidoManualId_fkey";

-- AlterTable
ALTER TABLE "PedidoManualItem" ALTER COLUMN "itemId" SET NOT NULL,
ALTER COLUMN "pedidoManualId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
