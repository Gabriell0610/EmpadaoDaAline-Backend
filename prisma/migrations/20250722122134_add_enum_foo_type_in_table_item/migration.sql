-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('EMPADAO', 'PANQUECA', 'ALMONDEGA');

-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "tipo" "FoodType";
