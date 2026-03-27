/*
  Warnings:

  - The values [EXPIRADO] on the enum `StatusCart` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusCart_new" AS ENUM ('ATIVO', 'FINALIZADO');
ALTER TABLE "Carrinho" ALTER COLUMN "status" TYPE "StatusCart_new" USING ("status"::text::"StatusCart_new");
ALTER TYPE "StatusCart" RENAME TO "StatusCart_old";
ALTER TYPE "StatusCart_new" RENAME TO "StatusCart";
DROP TYPE "StatusCart_old";
COMMIT;
