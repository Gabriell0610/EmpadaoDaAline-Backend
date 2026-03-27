import { StatusCart } from "@prisma/client";
import { z } from "zod";
import { extendZodWithOpenApi } from "zod-openapi";

extendZodWithOpenApi(z);

const createCartSchema = z.object({
  status: z.nativeEnum(StatusCart).default(StatusCart.ATIVO),
  itemId: z.string(),
  quantity: z.number().default(1),
});

type CreateCartDto = z.infer<typeof createCartSchema>;

export { createCartSchema, CreateCartDto };
