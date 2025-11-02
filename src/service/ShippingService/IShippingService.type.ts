import { Decimal } from "@prisma/client/runtime/library"

interface IShippingService {
    calculateShippingByAddressUser: (idAddress: string) => Promise<Decimal>
}

export {IShippingService}