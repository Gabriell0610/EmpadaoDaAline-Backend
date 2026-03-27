/*
  Warnings:

  - Changed the type of `disponivel` on the `itens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `pedidos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "statusPedido" AS ENUM ('ACEITO', 'PENDENTE', 'PREPARANDO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "statusItem" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "disponivel",
ADD COLUMN     "disponivel" "statusItem" NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "status",
ADD COLUMN     "status" "statusPedido" NOT NULL;

-- DropEnum
DROP TYPE "status";
