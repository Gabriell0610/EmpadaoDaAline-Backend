
import { startAndEndTimeValidation } from "@/utils/zod/validations/timeOrder";
import { StatusOrder } from "@prisma/client";
import { z } from "zod";

import { extendZodWithOpenApi } from "zod-openapi";

extendZodWithOpenApi(z)


const orderSchema = z.object({
  idUser: z.string().min(1, "O id do usuário é obrigatório"), 
  idCart: z.string().min(1, "O id do carrinho é obrigatório"),
  idAddress: z.string().min(1, "O id do endereço é obrigatório"),
  idPaymentMethod: z.string().min(1, "O id do metodo de pagamento é obrigatório"),
  status: z.nativeEnum(StatusOrder).default(StatusOrder.PENDENTE),
  schedulingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD")
    .transform((val) => new Date(val + "T00:00:00")),
  deliveryTimeStart:startAndEndTimeValidation,
  deliveryTimeEnd:startAndEndTimeValidation,
  observation: z.string().optional(),
  shipping: z.string({
    required_error: "O frete é obrigatório",
    invalid_type_error: "O frete deve ter um valor válido",
  }).regex(/^\d+(\.\d{1,2})?$/)
});

const updateOrderSchema = z.object({
  idAddress: z.string().optional(),
  idPaymentMethod: z.string().optional(),
   schedulingDate: z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD")
  .transform((val) => new Date(val + "T00:00:00")).optional(),
  startTime: startAndEndTimeValidation.optional(),
  endTime: startAndEndTimeValidation.optional(),
  observation: z.string().optional(),
});



type OrderDto = z.infer<typeof orderSchema>;
type UpdateOrderDto = z.infer<typeof updateOrderSchema>;

export { orderSchema, updateOrderSchema, OrderDto, UpdateOrderDto};
