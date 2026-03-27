/*
  Warnings:

  - Made the column `nome` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senha` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cep` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rua` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bairro` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numero` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cidade` on table `enderecos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estado` on table `enderecos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nome" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "senha" SET NOT NULL,
ALTER COLUMN "telefone" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;

-- AlterTable
ALTER TABLE "enderecos" ALTER COLUMN "cep" SET NOT NULL,
ALTER COLUMN "rua" SET NOT NULL,
ALTER COLUMN "bairro" SET NOT NULL,
ALTER COLUMN "numero" SET NOT NULL,
ALTER COLUMN "cidade" SET NOT NULL,
ALTER COLUMN "estado" SET NOT NULL;
