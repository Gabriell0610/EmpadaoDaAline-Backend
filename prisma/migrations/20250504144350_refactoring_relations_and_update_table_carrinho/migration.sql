/*
  Warnings:

  - You are about to drop the column `dataExpiracao` on the `Carrinho` table. All the data in the column will be lost.
  - You are about to drop the `pedido_itens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[carrinhoId]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carrinhoId` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_itemId_fkey";

-- DropForeignKey
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_pedidoId_fkey";

-- AlterTable
ALTER TABLE "Carrinho" DROP COLUMN "dataExpiracao";

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "carrinhoId" TEXT NOT NULL;

-- DropTable
DROP TABLE "pedido_itens";

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_carrinhoId_key" ON "pedidos"("carrinhoId");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "Carrinho"("id") ON DELETE CASCADE ON UPDATE CASCADE;
