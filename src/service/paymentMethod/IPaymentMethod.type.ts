import { MethodPaymentEntity } from "@/domain/model";


export interface IPaymentMethodService {
    listAllPaymentMethods: () => Promise<MethodPaymentEntity[]>
}