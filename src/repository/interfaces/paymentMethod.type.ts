import { MethodPaymentEntity } from "@/domain/model";


export interface IPaymentMethodRepository {
    listAllPaymentMethods: () => Promise<MethodPaymentEntity[]>
}