import { PaymentMthod, StatusOrder } from "@prisma/client";;
import { z } from "zod";

export const commonOrder = z.object({
  status: z.nativeEnum(StatusOrder).default(StatusOrder.PENDENTE),
  paymentMethod: z.nativeEnum(PaymentMthod),
  schedulingDate: z
    .string({
      required_error: "A data de agendamento é obrigatória",
      invalid_type_error: "A data de agendamento deve ser uma string no formato ISO (YYYY-MM-DD)",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "A data de agendamento deve ser uma data válida",
    })
    .transform((val) => new Date(val)),
  deliveryTime: z.string(),
  observation: z.string().optional(),
  shipping: z.number()
})

const orderSchema = commonOrder.extend({
  idUser: z.string().min(1, "O id do usuário é obrigatório"), 
  idCart: z.string().min(1, "O id do carrinho é obrigatório"),
  idAddress: z.string().min(1, "O id do endereço é obrigatório"),
});

const updateOrderSchema = z.object({
  idAddress: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMthod).optional(),
  schedulingDate: z
    .string({
      required_error: "A data de agendamento é obrigatória",
      invalid_type_error: "A data de agendamento deve ser uma string no formato ISO (YYYY-MM-DD)",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "A data de agendamento deve ser uma data válida",
    })
    .transform((val) => new Date(val))
    .optional(),
  deliveryTime: z.string().optional(),
  observation: z.string().optional(),
});



type OrderDto = z.infer<typeof orderSchema>;
type UpdateOrderDto = z.infer<typeof updateOrderSchema>;

export { orderSchema, updateOrderSchema, OrderDto, UpdateOrderDto};
