import { Decimal } from "@prisma/client/runtime/library"

interface IShippingService {
    getShippingByAddressUser: (idAddress: string) => Promise<Decimal>
}

export {IShippingService}