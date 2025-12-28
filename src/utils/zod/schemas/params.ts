import { z } from "zod";
import { StatusOrder } from "@prisma/client";

export const listOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 1))
    .refine((v) => v > 0, { message: "page deve ser maior que 0" }),

  size: z
    .string()
    .optional()
    .transform((v) => Number(v ?? 9))
    .refine((v) => v > 0 && v <= 100, {
      message: "o tamanho deve ser entre 1 e 100",
    }),

  status: z.nativeEnum(StatusOrder).optional(),

  search: z.string().optional(),

  orderBy: z
    .enum(["dataCriacao", "numeroPedido", "status"])
    .default("dataCriacao"),

  direction: z.enum(["asc", "desc"]).default("desc"),
});

export type ListQueryOrdersDto = z.infer<typeof listOrdersQuerySchema>

export interface PaginationInterface {
  page: number,
  size: number,
  totalItems: number
  totalPages: number
}
