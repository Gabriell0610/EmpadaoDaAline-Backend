/*
  Warnings:

  - You are about to drop the column `data de atualizacao` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `precoUnitario` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `PedidoManual` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PedidoManual" DROP CONSTRAINT "PedidoManual_itemId_fkey";

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
DROP COLUMN "itemId",
DROP COLUMN "precoUnitario",
DROP COLUMN "quantidade";

-- CreateTable
CREATE TABLE "PedidoManualItem" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DECIMAL(10,2) NOT NULL,
    "itemId" TEXT NOT NULL,
    "pedidoManualId" TEXT NOT NULL,

    CONSTRAINT "PedidoManualItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
