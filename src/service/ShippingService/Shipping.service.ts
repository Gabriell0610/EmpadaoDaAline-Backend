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

  calculateShippingByAddressUser = async (idAddress: string, userId: string) => {
    const addresses = await this.addressRepository.findAddressByUserId(userId);
    const userAddress = addresses.find((address) => address.endereco.id === idAddress)?.endereco;

    if (!userAddress) {
      throw new BadRequestException("Endereco nao encontrado para este usuario");
    }

    const destination = `${userAddress.rua} ${userAddress.numero} ${userAddress.bairro} ${userAddress.cidade} ${userAddress.estado}`;

    const response = await this.distanceProvider.getDistance(this.ORIGIN, destination);
    const distanceValue = response.rows[0].elements[0].distance?.value;

    if (!distanceValue) {
      throw new BadRequestException("Distancia nao disponivel para o endereco informado");
    }

    const price = this.calculateShipping(distanceValue);
    return new Decimal(price);
  };

  private calculateShipping(distance: number) {
    if (distance < 1000) {
      return 5;
    }

    const price = (distance / 1000) * 2.5;
    return price.toFixed(2);
  }
}
