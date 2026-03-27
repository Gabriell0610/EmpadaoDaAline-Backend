/*
  Warnings:

  - You are about to drop the column `precoUnitario` on the `PedidoManualItem` table. All the data in the column will be lost.
  - You are about to drop the column `pedidoManualId` on the `pedidos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroPedido]` on the table `PedidoManual` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meioPagamento` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroPedido` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precoTotal` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_pedidoManualId_fkey";

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_pedidoManualId_fkey";

-- AlterTable
ALTER TABLE "PedidoManual" ADD COLUMN     "data de atualizacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "meioPagamento" "meioPagamento" NOT NULL,
ADD COLUMN     "numeroPedido" INTEGER NOT NULL,
ADD COLUMN     "observacao" VARCHAR,
ADD COLUMN     "precoTotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "status" "status" NOT NULL;

-- AlterTable
ALTER TABLE "PedidoManualItem" DROP COLUMN "precoUnitario",
ALTER COLUMN "itemId" DROP NOT NULL,
ALTER COLUMN "pedidoManualId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "pedidoManualId";

-- CreateIndex
CREATE UNIQUE INDEX "PedidoManual_numeroPedido_key" ON "PedidoManual"("numeroPedido");

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE SET NULL ON UPDATE CASCADE;
