import { ItemSize, StatusItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

const itemCreateBodySchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }).min(4, "O item deve ter no mínimo 4 caracteres"),
  price: z.number({ required_error: "O preço é obrigatório" }).transform((val) => new Decimal(val)),
  description: z
    .string({ required_error: "A descrição é obrigatória" })
    .min(10, "A descrição não pode ser muito pequena"),
  image: z.string({ required_error: "A imagem é obrigatório" }),
  available: z.nativeEnum(StatusItem).default(StatusItem.ATIVO),
  size: z.nativeEnum(ItemSize),
  unitPrice: z.number().optional(),
});

const itemUpdateBodySchema = z.object({
  name: z.string().optional(),
  price: z
    .string()
    .transform((val) => new Decimal(val))
    .optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  available: z.nativeEnum(StatusItem).optional(),
  size: z.nativeEnum(ItemSize).optional(),
  unitPrice: z.string().optional(),
});

type ItemCreateDto = z.infer<typeof itemCreateBodySchema>;
type ItemUpdateDto = z.infer<typeof itemUpdateBodySchema>;

export { itemCreateBodySchema, ItemCreateDto, itemUpdateBodySchema, ItemUpdateDto };
