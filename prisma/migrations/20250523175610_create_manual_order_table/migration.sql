-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "itemId" TEXT,
ALTER COLUMN "usuarioId" DROP NOT NULL,
ALTER COLUMN "enderecoId" DROP NOT NULL,
ALTER COLUMN "carrinhoId" DROP NOT NULL,
ALTER COLUMN "horarioDeEntrega" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PedidoManual" (
    "id" TEXT NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "telefoneCliente" TEXT NOT NULL,
    "enderecoCliente" TEXT NOT NULL,

    CONSTRAINT "PedidoManual_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoManualItem" ADD CONSTRAINT "PedidoManualItem_pedidoManualId_fkey" FOREIGN KEY ("pedidoManualId") REFERENCES "PedidoManual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
