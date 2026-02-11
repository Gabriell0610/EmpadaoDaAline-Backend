import { PaymentMehtodsEntity } from "@/domain/model/PaymentMethods";
import { IPaymentMethodRepository } from "@/repository/interfaces/paymentMethod.type";

class InMemoryPaymentMethodRepository implements IPaymentMethodRepository {
  paymentMethodsDb: PaymentMehtodsEntity[] = [];

  listAllPaymentMethods = async (): Promise<PaymentMehtodsEntity[]> => {
    return this.paymentMethodsDb;
  };
}

export { InMemoryPaymentMethodRepository };
