import { ItemSize } from "@prisma/client";

export const SizeItemDescription: Record<ItemSize, string> = {
  [ItemSize.P]: "500g",
  [ItemSize.M]: "750g",
  [ItemSize.G]: "1kg",
  [ItemSize.GG]: "1,5kg",
};
