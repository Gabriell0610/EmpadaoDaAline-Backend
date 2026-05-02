import { StatusOrder } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from "../order/OrderDto";
import { cellphoneValidaton } from "@/utils/zod/validations/cellphone";
import { startAndEndTimeValidation } from "@/utils/zod/validations/timeOrder";

const manualOrderSchema = orderSchema.extend({});

const changeStatusSchema = z.object({
  status: z.nativeEnum(StatusOrder),
});

const updateManualOrderSchema = z.object({
  clientName: z.string().min(4, "Nome do cliente deve ter no mínimo 4 caracteres").optional(),
  cellphoneClient: cellphoneValidaton,
  addressClient: z.string().optional(),
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
  paymentMethodId: z.string(),
  schedulingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD")
    .transform((val) => new Date(val + "T00:00:00"))
    .optional(),
  startTime: startAndEndTimeValidation.optional(),
  endTime: startAndEndTimeValidation.optional(),
  observation: z.string().optional(),
});

type ManualOrderDto = z.infer<typeof manualOrderSchema>;
type UpdateManualOrderDto = z.infer<typeof updateManualOrderSchema>;

export { manualOrderSchema, ManualOrderDto, changeStatusSchema, updateManualOrderSchema, UpdateManualOrderDto };
