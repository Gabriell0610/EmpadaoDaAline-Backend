import { z } from "zod";

const itemTypeCreateBodySchema = z.object({
  nome: z.string({ required_error: "O nome do tipo é obrigatório" }).min(2, "O tipo deve ter no mínimo 2 caracteres"),
});

type ItemTypeCreateDto = z.infer<typeof itemTypeCreateBodySchema>;

export { itemTypeCreateBodySchema, ItemTypeCreateDto };
