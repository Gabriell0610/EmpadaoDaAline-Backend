/* eslint-disable @typescript-eslint/no-unused-vars */
import { Usuario } from "@prisma/client";
import { CreateUserDto } from "../../domain/dto/auth/CreateUserDto";
import { IUserRepository } from "../interfaces/index";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { randomUUID } from "crypto";
import { UserAddressEntity } from "@/domain/model";

class InMemoryUserRepository implements IUserRepository {
  userDatabase: Partial<Usuario>[] = [];

  create = async (data: CreateUserDto) => {
    const user: Partial<Usuario> = {
      id: randomUUID(),
      nome: data.name,
      email: data.email,
      senha: data.password,
      telefone: data.cellphone,
      role: data.role,
      createdAt: new Date(),
    };
    this.userDatabase.push(user);
    return user;
  };

  list = async () => {
    const datas = this.userDatabase.map(({ senha, ...userWhithoutPassword }) => {
      return userWhithoutPassword;
    });

    return datas;
  };

  userExistsByEmail = async (email: string) => {
    const user = this.userDatabase.find((user) => user.email === email);
    return user || null;
  };

  updateUser = async (dto: UpdateUserDto, userId: string) => {
    const findUser = this.userDatabase.find((user) => user.id === userId);

    if (!findUser) throw new Error("usuário nao encontrado");

    findUser.senha = dto?.password;
    findUser.nome = dto?.name;
    findUser.telefone = dto?.cellphone;
    findUser.updatedAt = new Date();

    return findUser;
  };

  findUserById!: (id: string) => Promise<Partial<Usuario> | null>;
  updateAddress!: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<Partial<void>>;
  removeAddress!: (userId: string, idAddress: string) => Promise<void>;
  addAddress!: (dto: AddressDto, userId: string) => Promise<void>;
  listAddressByUserId!: (userId: string) => Promise<UserAddressEntity[]>;
  listLoggedUser!: () => Promise<Partial<Usuario> | null>;
}

export { InMemoryUserRepository };
