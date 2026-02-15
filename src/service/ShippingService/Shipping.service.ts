import { IAddressRepository } from "@/repository/interfaces/address.type";
import { IShippingService } from "./IShippingService.type";
import { IDistanceProvider } from "../../provider/IDistanceProvider";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { Decimal } from "@prisma/client/runtime/library";

export class ShippingService implements IShippingService {
  constructor(
    private readonly addressRepository: IAddressRepository,
    private readonly distanceProvider: IDistanceProvider,
  ) {}

  private ORIGIN = "Rua Soares Miranda 159, Fonseca, Niteroi, RJ";

  calculateShippingByAddressUser = async (idAddress: string) => {
    const address = await this.addressRepository.findAddressById(idAddress);

    if (!address) {
      throw new BadRequestException("Endereço não encontrado");
    }

    const destination = `${address.rua} ${address.numero} ${address.bairro} ${address.cidade} ${address.estado}`;

    const response = await this.distanceProvider.getDistance(this.ORIGIN, destination);

    const distanceValue = response.rows[0].elements[0].distance?.value;

    if (!distanceValue) {
      throw new BadRequestException("Distância não disponível para o endereço informado");
    }

    const price = this.calculateShipping(distanceValue);

    return new Decimal(price);
  };

  private calculateShipping(distance: number) {
    if (distance < 1000) {
      const price = 5;
      return price;
    }

    const price = (distance / 1000) * 2.5;
    return price.toFixed(2);
  }
}
