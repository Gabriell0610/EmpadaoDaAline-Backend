import { IUserService } from "./IUserService.type";
import { IUserRepository } from "../../repository/interfaces";
import { BadRequestException } from "../../shared/error/exceptions/badRequest-exception";
import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { IAddressRepository } from "@/repository/interfaces/address.type";

class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private addressRepository: IAddressRepository,
  ) {}

  list = async () => {
    const res = this.userRepository.list();
    return res;
  };

  listLoggedUser = async (id: string) => {
    const res = await this.userRepository.listLoggedUser(id);
    return res;
  };

  updateUser = async (dto: UpdateUserDto, userId: string, userEmail: string) => {
    const userExist = await this.verifyUserExists(userId);

    if (userExist?.email !== userEmail) {
      throw new BadRequestException("Sem permisão para editar dados");
    }

    const updateUser = await this.userRepository.updateUser(dto, userId);

    return updateUser;
  };

  addAddress = async (dto: AddressDto, userId: string) => {
    const userAddress = await this.addressRepository.findAddressByUserId(userId);

    userAddress.map((address) => {
      if (
        address.endereco.cep === dto.zipCode &&
        address.endereco.numero === dto.number &&
        address.endereco.rua === dto.street
      ) {
        throw new BadRequestException("Você já possui esse endereço cadastrado");
      }
    });

    await this.userRepository.addAddress(dto, userId);
  };

  updateUserAddress = async (dto: AddressUpdateDto, userId: string, addressId: string) => {
    await this.userRepository.updateAddress(dto, userId, addressId);
  };

  removeAddress = async (addressId: string) => {
    this.userRepository.removeAddress(addressId);
  };

  listAddressByUserId = async (userId: string) => {
    const userAddresses = await this.userRepository.listAddressByUserId(userId);
    return userAddresses;
  };

  private verifyUserExists = async (userId: string) => {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException("Usuário não encontrado");
    }
    return user;
  };
}

export { UserService };
