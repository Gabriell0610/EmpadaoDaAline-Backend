import { PaymentMthod, StatusOrder } from "@prisma/client";
import { z } from "zod";
import { commonOrder } from "../order/OrderDto";
import { cellphoneValidaton } from "@/utils/zod/validations/cellphone";

const manualOrderSchema = commonOrder.extend({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  cellphoneClient: cellphoneValidaton,
  addressClient: z.string().min(10, "Endereço é obrigatório"),
  totalPrice: z.number(),
  products: z.array(
    z.object({
      itemId: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

const changeStatusSchema = z.object({
  status: z.nativeEnum(StatusOrder),
});

const updateManualOrderSchema = commonOrder.extend({
  clientName: z.string().min(1, "Nome do cliente é obrigatório").optional(),
  cellphoneClient: cellphoneValidaton,
  addressClient: z.string().min(10, "Endereço é obrigatório").optional(),
  totalPrice: z.number().optional(),
  products: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().default(1),
        idManualOrderItem: z.string().optional(),
      }),
    )
    .optional(),
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

type ManualOrderDto = z.infer<typeof manualOrderSchema>;
type UpdateManualOrderDto = z.infer<typeof updateManualOrderSchema>;

export { manualOrderSchema, ManualOrderDto, changeStatusSchema, updateManualOrderSchema, UpdateManualOrderDto };
