/*
  Warnings:

  - You are about to drop the column `enderecoCliente` on the `PedidoManual` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoManualItem" DROP CONSTRAINT "PedidoManualItem_pedidoManualId_fkey";

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "enderecoCliente",
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "data de atualizacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data de criacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataAgendamento" TIMESTAMP,
ADD COLUMN     "horarioDeEntrega" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "rua" TEXT,
ADD COLUMN     "statusPedido" "status";

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
