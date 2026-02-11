/* eslint-disable @typescript-eslint/no-unused-vars */
import { Usuario, UsuarioEndereco } from "@prisma/client";
import { CreateUserDto } from "../../domain/dto/auth/CreateUserDto";
import { IUserRepository } from "../interfaces/index";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { randomUUID } from "crypto";
import { UserAddressEntity } from "@/domain/model";

class InMemoryUserRepository implements IUserRepository {
  userDatabase: Usuario[] = [];
  userAddressDatabase: UserAddressEntity[] = [];

  create = async (data: CreateUserDto) => {
    const user: Usuario = {
      id: randomUUID(),
      nome: data.name,
      email: data.email,
      senha: data.password,
      telefone: data.cellphone,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
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

  findUserById = async (id: string) => {
    return this.userDatabase.find((user) => user.id === id) || null;
  };

  listLoggedUser = async (userId: string) => {
    const user = this.userDatabase.find((user) => user.id === userId);

    if (!user) return null;

    const userAddresses = this.userAddressDatabase.filter((address) => address.usuarioId === userId);
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      createdAt: user.createdAt,
      role: user.role,
      enderecos: userAddresses.map((address) => ({
        endereco: {
          id: address.endereco.id,
          rua: address.endereco.rua,
          numero: address.endereco.numero,
          cidade: address.endereco.cidade,
          estado: address.endereco.estado,
          bairro: address.endereco.bairro,
          cep: address.endereco.cep,
          complemento: address.endereco.complemento,
        },
      })),
    };
  };

  updateUser = async (dto: UpdateUserDto, userId: string) => {
    const findUser = this.userDatabase.find((user) => user.id === userId);

    if (!findUser) throw new Error("usuário nao encontrado");

    if (dto.password !== undefined) {
      findUser.senha = dto.password;
    }

    if (dto.name !== undefined) {
      findUser.nome = dto.name;
    }

    if (dto.cellphone !== undefined) {
      findUser.telefone = dto.cellphone;
    }

    findUser.updatedAt = new Date();

    return findUser;
  };

  updateAddress = async (dto: AddressUpdateDto, userId: string, addressId: string) => {
    const userAddress = this.userAddressDatabase.find(
      (item) => item.usuarioId === userId && item.enderecoId === addressId,
    );

    if (!userAddress) return;

    userAddress.endereco.rua = dto.street || userAddress.endereco.rua;
    userAddress.endereco.cep = dto.zipCode || userAddress.endereco.cep;
    userAddress.endereco.numero = dto.number || userAddress.endereco.numero;
    userAddress.endereco.bairro = dto.neighborhood || userAddress.endereco.bairro;
    userAddress.endereco.cidade = dto.city || userAddress.endereco.cidade;
    userAddress.endereco.estado = dto.state || userAddress.endereco.estado;
    userAddress.endereco.complemento = dto.complement ?? userAddress.endereco.complemento;
  };

  removeAddress = async (userId: string, idAddress: string) => {
    const index = this.userAddressDatabase.findIndex(
      (item) => item.usuarioId === userId && item.enderecoId === idAddress,
    );

    if (index !== -1) {
      this.userAddressDatabase.splice(index, 1);
    }
  };

  addAddress = async (dto: AddressDto, userId: string) => {
    this.userAddressDatabase.push({
      usuarioId: userId,
      enderecoId: randomUUID(),
      endereco: {
        id: randomUUID(),
        bairro: dto.neighborhood,
        cidade: dto.city,
        cep: dto.zipCode,
        complemento: dto.complement,
        estado: dto.state,
        numero: dto.number,
        rua: dto.street,
      },
    } as UsuarioEndereco & { endereco: UserAddressEntity["endereco"] });
  };

  listAddressByUserId = async (userId: string) => {
    return this.userAddressDatabase.filter((item) => item.usuarioId === userId);
  };
}

export { InMemoryUserRepository };
