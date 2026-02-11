/*
  Warnings:

  - You are about to drop the column `dataAgendamento` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `enderecoId` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `horarioDeEntrega` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `statusPedido` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the `PedidoManualItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PedidoManual" DROP CONSTRAINT "PedidoManual_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_pedidoManualId_fkey";

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_itemId_fkey";

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "dataAgendamento",
DROP COLUMN "enderecoId",
DROP COLUMN "horarioDeEntrega",
DROP COLUMN "statusPedido",
ADD COLUMN     "itemId" TEXT,
ADD COLUMN     "precoUnitario" DECIMAL(10,2),
ADD COLUMN     "quantidade" INTEGER;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "itemId",
ADD COLUMN     "pedidoManualId" TEXT;

-- DropTable
DROP TABLE "PedidoManualItem";

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManual" ADD CONSTRAINT "PedidoManual_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
