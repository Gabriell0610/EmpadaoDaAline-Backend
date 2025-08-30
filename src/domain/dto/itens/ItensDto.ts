import { ItemSize, statusItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

const itemCreateBodySchema = z.object({
  name: z.string().min(1, "O nome do item é obrigatório"),
  price: z
    .number()
    .min(1, "O preço do item é obrigatório")
    .transform((val) => new Decimal(val)),
  description: z.string().min(1, "A descrião do item é obrigatório"),
  image: z.string(),
  available: z.nativeEnum(statusItem).default(statusItem.ATIVO),
  size: z.nativeEnum(ItemSize),
  unitPrice: z.number().optional()
});

const itemUpdateBodySchema = z.object({
  name: z.string().optional(),
  price: z
    .number()
    .transform((val) => new Decimal(val))
    .optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  available: z.nativeEnum(statusItem).optional(),
  size: z.nativeEnum(ItemSize).optional(),
  unitPrice: z.number().optional()
});

type ItemCreateDto = z.infer<typeof itemCreateBodySchema>;
type ItemUpdateDto = z.infer<typeof itemUpdateBodySchema>;

export { itemCreateBodySchema, ItemCreateDto, itemUpdateBodySchema, ItemUpdateDto };
