import { PaymentMehtodsEntity } from "@/domain/model/PaymentMethods";

export interface IPaymentMethodService {
    listAllPaymentMethods: () => Promise<PaymentMehtodsEntity[]>
}