import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { ListUserLoggedDto, UserAddressEntity, UserEntity } from "@/domain/model";

interface IUserService {
  list: () => Promise<Partial<UserEntity>[]>;
  updateUser: (dto: UpdateUserDto, userId: string, userEmail: string) => Promise<Partial<UserEntity>>;
  listLoggedUser: (id: string) => Promise<ListUserLoggedDto | null>;
  removeAddress: (idAddress: string) => Promise<void>;
  addAddress: (dto: AddressDto, userId: string) => Promise<void>;
  updateUserAddress: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<void>;
  listAddressByUserId: (userId: string) => Promise<UserAddressEntity[]>;
}

export { IUserService };
