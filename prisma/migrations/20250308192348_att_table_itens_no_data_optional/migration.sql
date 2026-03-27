/*
  Warnings:

  - Made the column `nome` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preco` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descricao` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `disponivel` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `precoTotal` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `meioPagamento` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "itens" ALTER COLUMN "nome" SET NOT NULL,
ALTER COLUMN "preco" SET NOT NULL,
ALTER COLUMN "descricao" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "disponivel" SET NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "precoTotal" SET NOT NULL,
ALTER COLUMN "meioPagamento" SET NOT NULL;
