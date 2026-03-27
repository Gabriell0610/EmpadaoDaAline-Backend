/*
  Warnings:

  - Added the required column `frete` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Made the column `preco` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `frete` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PedidoManual" ADD COLUMN     "frete" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "itens" ALTER COLUMN "preco" SET NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "frete" DECIMAL(10,2) NOT NULL;
