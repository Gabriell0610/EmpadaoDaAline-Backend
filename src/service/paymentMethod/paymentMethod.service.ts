
import { IPaymentMethodRepository } from "@/repository/interfaces/paymentMethod.type";
import { IPaymentMethodService } from "./IPaymentMethod.type";


export class PaymentMethodService implements IPaymentMethodService {

    constructor (private paymentMethodRepository: IPaymentMethodRepository) {}

    listAllPaymentMethods = async () =>  {
        return this.paymentMethodRepository.listAllPaymentMethods();
    }

}