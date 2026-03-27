/*
  Warnings:

  - You are about to alter the column `precoAtual` on the `CarrinhoItens` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(10,2)`.
  - You are about to alter the column `preco` on the `itens` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(10,2)`.
  - You are about to alter the column `precoAtual` on the `pedido_itens` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(10,2)`.
  - You are about to alter the column `precoTotal` on the `pedidos` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "CarrinhoItens" ALTER COLUMN "precoAtual" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "itens" ALTER COLUMN "preco" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "pedido_itens" ALTER COLUMN "precoAtual" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "precoTotal" SET DATA TYPE DECIMAL(10,2);
