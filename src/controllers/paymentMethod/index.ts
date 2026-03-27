import { PaymentMethodService } from "@/service/paymentMethod/paymentMethod.service";
import { PaymentMethodController } from "./paymentMethod.controller";
import { PaymentMethodRepository } from "@/repository/prisma/paymentMethod/paymentMethod.prisma";


const paymentMethodRepository = new PaymentMethodRepository()
const paymentMethodService = new PaymentMethodService(paymentMethodRepository)

export const paymentMethodController = new PaymentMethodController(paymentMethodService)