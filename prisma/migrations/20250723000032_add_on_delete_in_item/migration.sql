-- DropForeignKey
ALTER TABLE "itens" DROP CONSTRAINT "itens_itemDescriptionId_fkey";

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_itemDescriptionId_fkey" FOREIGN KEY ("itemDescriptionId") REFERENCES "ItemDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
