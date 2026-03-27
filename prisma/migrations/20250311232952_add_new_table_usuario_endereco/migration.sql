/*
  Warnings:

  - You are about to drop the `_UsuarioEndereco` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarrinhoItens" DROP CONSTRAINT "CarrinhoItens_carrinhoId_fkey";

-- DropForeignKey
ALTER TABLE "CarrinhoItens" DROP CONSTRAINT "CarrinhoItens_itemId_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioEndereco" DROP CONSTRAINT "_UsuarioEndereco_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioEndereco" DROP CONSTRAINT "_UsuarioEndereco_B_fkey";

-- DropForeignKey
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_itemId_fkey";

-- DropForeignKey
ALTER TABLE "pedido_itens" DROP CONSTRAINT "pedido_itens_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_usuarioId_fkey";

-- DropTable
DROP TABLE "_UsuarioEndereco";

-- CreateTable
CREATE TABLE "usuario_endereco" (
    "usuarioId" TEXT NOT NULL,
    "enderecoId" TEXT NOT NULL,

    CONSTRAINT "usuario_endereco_pkey" PRIMARY KEY ("usuarioId","enderecoId")
);

-- AddForeignKey
ALTER TABLE "usuario_endereco" ADD CONSTRAINT "usuario_endereco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_endereco" ADD CONSTRAINT "usuario_endereco_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrinhoItens" ADD CONSTRAINT "CarrinhoItens_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "Carrinho"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrinhoItens" ADD CONSTRAINT "CarrinhoItens_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
