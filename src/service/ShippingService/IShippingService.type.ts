import { Decimal } from "@prisma/client/runtime/library";

interface IShippingService {
  calculateShippingByAddressUser: (idAddress: string, userId: string) => Promise<Decimal>;
}

export { IShippingService };
