import { z } from "zod";
import { StatusOrder } from "@prisma/client";
import { isValid } from "date-fns";

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
    .enum(["createdAt", "numeroPedido", "status"])
    .default("createdAt"),

  direction: z.enum(["asc", "desc"]).default("desc"),

   startDate: z
     .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD")
        .transform((val) => new Date(val + "T00:00:00.000Z"))
        .refine((date) => isValid(date), {
          message: "Data inválida",
        }).optional(),
  endDate: z
    .string()
       .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD")
       .transform((val) => new Date(val + "T23:59:59.999Z"))
       .refine((date) => isValid(date), {
         message: "Data inválida",
       }).optional()
});

export type ListQueryOrdersDto = z.infer<typeof listOrdersQuerySchema>

export interface PaginationInterface {
  page: number,
  size: number,
  totalItems: number
  totalPages: number
}


export const dashboardQueryParams = z.object({
  period: z.string()
})

export type DashboardQueryParams = z.infer<typeof dashboardQueryParams>
