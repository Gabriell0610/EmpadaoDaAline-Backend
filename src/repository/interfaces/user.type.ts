
import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { UserAddressEntity, UserEntity } from "@/domain/model";
import { CreateUserDto } from "@/domain/dto/auth/CreateUserDto";

interface IUserRepository {
  create: (dto: CreateUserDto) => Promise<Partial<UserEntity>>;
  list: () => Promise<Partial<UserEntity>[]>;
  userExistsByEmail: (email: string) => Promise<Partial<UserEntity> | null>;
  findUserById: (id: string) => Promise<Partial<UserEntity> | null>;
  listLoggedUser:(userId: string) => Promise<Partial<UserEntity> | null>;
  updateUser: (dto: UpdateUserDto, userId: string) => Promise<Partial<UserEntity>>;
  removeAddress: (userId: string, idAddress: string) => Promise<void>;
  addAddress: (dto: AddressDto, userId: string) => Promise<void>;
  updateAddress: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<void>;
  listAddressByUserId: (userId: string) => Promise<UserAddressEntity[]>;
}

export { IUserRepository };
