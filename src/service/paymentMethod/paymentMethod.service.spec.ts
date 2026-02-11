import { InMemoryPaymentMethodRepository } from "@/repository/in-memory/paymentMethod";
import { PaymentMethodService } from "./paymentMethod.service";
import { randomUUID } from "crypto";

describe("Unit test - PaymentMethodService", () => {
  let paymentMethodRepositoryInMemory: InMemoryPaymentMethodRepository;
  let paymentMethodService: PaymentMethodService;

  beforeEach(() => {
    paymentMethodRepositoryInMemory = new InMemoryPaymentMethodRepository();
    paymentMethodService = new PaymentMethodService(paymentMethodRepositoryInMemory);
  });

  it("should list all payment methods", async () => {
    paymentMethodRepositoryInMemory.paymentMethodsDb.push({
      id: randomUUID(),
      nome: "Pix",
    });

    const result = await paymentMethodService.listAllPaymentMethods();

    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe("Pix");
  });

  it("should return empty list when no payment method exists", async () => {
    const result = await paymentMethodService.listAllPaymentMethods();

    expect(result).toEqual([]);
  });
});
