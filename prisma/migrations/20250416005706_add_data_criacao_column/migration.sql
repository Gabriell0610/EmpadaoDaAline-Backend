-- AlterTable
ALTER TABLE "enderecos" ADD COLUMN     "data de atualizacao" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data de criacao" DATE DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "token_resets" ADD COLUMN     "data de criacao" DATE DEFAULT CURRENT_TIMESTAMP;
