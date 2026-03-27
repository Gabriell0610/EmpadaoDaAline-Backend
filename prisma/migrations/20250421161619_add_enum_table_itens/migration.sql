/*
  Warnings:

  - Changed the type of `status` on the `pedidos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('ACEITO', 'PENDENTE', 'PREPARANDO', 'ENTREGUE', 'CANCELADO');

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL;

-- DropEnum
DROP TYPE "statusPedido";
