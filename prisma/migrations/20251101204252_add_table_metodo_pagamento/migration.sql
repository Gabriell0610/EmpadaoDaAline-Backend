/*
  Warnings:

  - You are about to drop the column `meioPagamento` on the `pedidos` table. All the data in the column will be lost.
  - Added the required column `metodoPagamentoId` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "meioPagamento",
ADD COLUMN     "metodoPagamentoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MetodoPagamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "pedidoManualId" TEXT NOT NULL,

    CONSTRAINT "MetodoPagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MetodoPagamento" ADD CONSTRAINT "MetodoPagamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetodoPagamento" ADD CONSTRAINT "MetodoPagamento_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
