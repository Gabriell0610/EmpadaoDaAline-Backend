import { PaymentMehtodsEntity } from "@/domain/model/PaymentMethods";



export interface IPaymentMethodRepository {
    listAllPaymentMethods: () => Promise<PaymentMehtodsEntity[]>
}