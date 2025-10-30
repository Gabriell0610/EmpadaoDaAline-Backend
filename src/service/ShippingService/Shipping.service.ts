import { IAddressRepository } from "@/repository/interfaces/address.type";
import { IShippingService } from "./IShippingService.type";
import { IDistanceProvider } from "../../provider/IDistanceProvider";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";

export class ShippingService implements IShippingService {

    constructor(
        private readonly addressRepository: IAddressRepository,
        private readonly distanceProvider: IDistanceProvider,
    ) {}

    private ORIGIN = "Rua Soares Miranda 159, Fonseca, Niteroi, RJ"


    getShippingByAddressUser = async (idAddress: string) => {
        const address = await this.addressRepository.findAddressById(idAddress)

        if(!address) {
            throw new BadRequestException("Endereco não encontrado")
        }

        const destination = `${address.rua}${address.numero}${address.bairro}${address.cidade}${address.estado}`

        const response = await this.distanceProvider.getDistance(this.ORIGIN, destination)

        const price = this.calculateShipping(response.distance.value)
        
        return new Decimal(price)

    }

    private calculateShipping(distance: number) {
        const price = (distance / 1000) * 5

        return price.toFixed(2)
    }

}