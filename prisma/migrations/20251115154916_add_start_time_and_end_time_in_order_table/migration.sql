/*
  Warnings:

  - You are about to drop the column `horarioDeEntrega` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `horarioDeEntrega` on the `pedidos` table. All the data in the column will be lost.
  - Made the column `data de criacao` on table `Carrinho` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de atualizacao` on table `ItemDescription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de criacao` on table `ItemDescription` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `horarioFim` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioInicio` to the `PedidoManual` table without a default value. This is not possible if the table is not empty.
  - Made the column `data de criacao` on table `PedidoManual` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de atualizacao` on table `PedidoManual` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dataAgendamento` on table `PedidoManual` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de criacao` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de atualizacao` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de atualizacao` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de criacao` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de atualizacao` on table `itens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data de criacao` on table `token_resets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Carrinho" ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "ItemDescription" ALTER COLUMN "data de atualizacao" SET NOT NULL,
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "horarioDeEntrega",
ADD COLUMN     "horarioFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horarioInicio" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "data de atualizacao" SET NOT NULL,
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dataAgendamento" SET NOT NULL,
ALTER COLUMN "dataAgendamento" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "data de atualizacao" SET NOT NULL,
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "enderecos" ALTER COLUMN "data de atualizacao" SET NOT NULL,
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "data de criacao" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "data de atualizacao" SET NOT NULL,
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "horarioDeEntrega",
ADD COLUMN     "horarioFim" TIMESTAMP(3),
ADD COLUMN     "horarioInicio" TIMESTAMP(3),
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "data de atualizacao" DROP DEFAULT,
ALTER COLUMN "data de atualizacao" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dataAgendamento" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "token_resets" ALTER COLUMN "data de criacao" SET NOT NULL,
ALTER COLUMN "data de criacao" SET DATA TYPE TIMESTAMPTZ(3);
