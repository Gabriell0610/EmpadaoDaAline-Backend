import { IUserService } from "./IUserService.type";
import { IUserRepository } from "../../repository/interfaces";
import { BadRequestException } from "../../shared/error/exceptions/badRequest-exception";
import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";

class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

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

    //validar endereço ja existente para o usuário
    await this.userRepository.addAddress(dto, userId);
  };

  updateUserAddress = async (dto: AddressUpdateDto, userId: string, addressId: string) => {
    await this.userRepository.updateAddress(dto, userId, addressId);
  };

  removeAddress = async (userId: string, addressId: string) => {
    this.userRepository.removeAddress(userId, addressId);
  };

  listAddressByUserId = async (userId: string) => {
    const userAddresses = await this.userRepository.listAddressByUserId(userId);
    return userAddresses;
  };

  private verifyUserExists = async (userId: string) => {
    const user = await this.userRepository.findUserById(userId);
    if(!user) {
      throw new BadRequestException("Usuário não encontrado")
    }
    return user
  }
}

export { UserService };
