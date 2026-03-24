import { IAddressRepository } from "@/repository/interfaces/address.type";
import { addressEntity } from "@/domain/model/AddressEntity";
import { randomUUID } from "node:crypto";

class InMemoryAddressRepository implements IAddressRepository {
  addressDb: Partial<addressEntity>[] = [];
  userAddressLink: Array<{ usuarioId: string; enderecoId: string }> = [];

  findAddressById = async (id: string): Promise<Partial<addressEntity | null>> => {
    return this.addressDb.find((item) => item.id === id) || null;
  };

  findAddressByUserId = async (userId: string) => {
    return this.userAddressLink
      .filter((link) => link.usuarioId === userId)
      .map((link) => {
        const address = this.addressDb.find((item) => item.id === link.enderecoId);

        return {
          endereco: {
            id: address?.id || randomUUID(),
            bairro: address?.bairro || "",
            cidade: address?.cidade || "",
            cep: address?.cep || "",
            complemento: address?.complemento || null,
            estado: address?.estado || "",
            numero: address?.numero || "",
            rua: address?.rua || "",
          },
        };
      });
  };
}

export { InMemoryAddressRepository };
