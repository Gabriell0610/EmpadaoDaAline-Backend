import { IPaymentMethodRepository } from "@/repository/interfaces/paymentMethod.type";
import { prisma } from "@/libs/prisma";

export class PaymentMethodRepository implements IPaymentMethodRepository {

    listAllPaymentMethods = async () =>  {
        return prisma.metodoPagamento.findMany({
            select: {
                id: true,
                nome: true,
            }
        })
    }
    
}