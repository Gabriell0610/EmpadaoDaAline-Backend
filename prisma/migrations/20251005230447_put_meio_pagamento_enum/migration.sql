/*
  Warnings:

  - The values [CARTAO_CREDITO,CARTAO_DEBITO] on the enum `meioPagamento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "meioPagamento_new" AS ENUM ('PIX', 'CARTAO', 'DINHERO');
ALTER TABLE "pedidos" ALTER COLUMN "meioPagamento" TYPE "meioPagamento_new" USING ("meioPagamento"::text::"meioPagamento_new");
ALTER TABLE "PedidoManual" ALTER COLUMN "meioPagamento" TYPE "meioPagamento_new" USING ("meioPagamento"::text::"meioPagamento_new");
ALTER TYPE "meioPagamento" RENAME TO "meioPagamento_old";
ALTER TYPE "meioPagamento_new" RENAME TO "meioPagamento";
DROP TYPE "meioPagamento_old";
COMMIT;
