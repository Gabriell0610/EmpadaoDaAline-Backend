/*
  Warnings:

  - You are about to drop the column `data de criacao` on the `Carrinho` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `ItemDescription` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `ItemDescription` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `PedidoManual` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `enderecos` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `enderecos` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `data de atualizacao` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `data de criacao` on the `token_resets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Carrinho" DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItemDescription" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "PedidoManual" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "enderecos" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "itens" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "data de atualizacao",
DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3),
ALTER COLUMN "dataAgendamento" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "token_resets" DROP COLUMN "data de criacao",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP;
