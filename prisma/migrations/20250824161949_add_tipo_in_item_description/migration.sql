-- CreateEnum
CREATE TYPE "UnityItem" AS ENUM ('MEIA_DUZIA', 'UMA_DUZIA');

-- CreateEnum
CREATE TYPE "TypeItem" AS ENUM ('EMPADAO', 'PANQUECA', 'ALMONDEGA');

-- AlterTable
ALTER TABLE "ItemDescription" ADD COLUMN     "tipo" "TypeItem";
