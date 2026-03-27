/*
  Warnings:

  - The `disponivel` column on the `ItemDescription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `meioPagamento` on the `PedidoManual` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `PedidoManual` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `meioPagamento` on the `pedidos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `dataAgendamento` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuarioId` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enderecoId` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `pedidos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `carrinhoId` on table `pedidos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `horarioDeEntrega` on table `pedidos` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('ACEITO', 'PENDENTE', 'PREPARANDO', 'ENTREGUE', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusItem" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "PaymentMthod" AS ENUM ('PIX', 'CARTAO', 'DINHERO');

-- AlterTable
ALTER TABLE "ItemDescription" DROP COLUMN "disponivel",
ADD COLUMN     "disponivel" "StatusItem";

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "meioPagamento",
ADD COLUMN     "meioPagamento" "PaymentMthod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusOrder" NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "meioPagamento",
ADD COLUMN     "meioPagamento" "PaymentMthod" NOT NULL,
ALTER COLUMN "dataAgendamento" SET NOT NULL,
ALTER COLUMN "usuarioId" SET NOT NULL,
ALTER COLUMN "enderecoId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusOrder" NOT NULL,
ALTER COLUMN "carrinhoId" SET NOT NULL,
ALTER COLUMN "horarioDeEntrega" SET NOT NULL;

-- DropEnum
DROP TYPE "meioPagamento";

-- DropEnum
DROP TYPE "status";

-- DropEnum
DROP TYPE "statusItem";
