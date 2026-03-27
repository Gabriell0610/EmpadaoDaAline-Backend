-- CreateTable
CREATE TABLE "token_resets" (
    "id" TEXT NOT NULL,
    "token" VARCHAR NOT NULL,
    "expiraEm" TIMESTAMP NOT NULL,
    "status" BOOLEAN NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "token_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_resets_token_key" ON "token_resets"("token");

-- AddForeignKey
ALTER TABLE "token_resets" ADD CONSTRAINT "token_resets_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
