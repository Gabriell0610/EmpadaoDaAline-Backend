import { UpdateUserDto } from "@/domain/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/domain/dto/address/AddressDto";
import { ListUserLoggedDto, UserAddressEntity, UserEntity } from "@/domain/model";
import { CreateUserDto } from "@/domain/dto/auth/CreateUserDto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemSize, StatusItem, TypeItem } from "@prisma/client";

export interface UserLoggedInterface {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
  };
  carrinho: {
    status: string;
    valorTotal: Decimal | null;
    carrinhoItens: {
      precoAtual: Decimal;
      quantidade: number;
      item: {
        id: string;
        preco: Decimal;
        tamanho: ItemSize | null;
        unidades: number | null;
        precoUnitario: Decimal | null;
        itemDescription: {
          id: string;
          image: string;
          nome: string;
          tipo: TypeItem | null;
          disponivel: StatusItem | null;
          descricao: string | null;
        } | null;
      };
    }[];
  };
  pedidos: string;
  createdAt: string;
  role: string;
}

interface IUserRepository {
  create: (dto: CreateUserDto) => Promise<Partial<UserEntity>>;
  list: () => Promise<Partial<UserEntity>[]>;
  userExistsByEmail: (email: string) => Promise<Partial<UserEntity> | null>;
  findUserById: (id: string) => Promise<Partial<UserEntity> | null>;
  listLoggedUser: (userId: string) => Promise<ListUserLoggedDto | null>;
  updateUser: (dto: UpdateUserDto, userId: string) => Promise<Partial<UserEntity>>;
  removeAddress: (idAddress: string) => Promise<void>;
  addAddress: (dto: AddressDto, userId: string) => Promise<void>;
  updateAddress: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<void>;
  listAddressByUserId: (userId: string) => Promise<UserAddressEntity[]>;
}

export { IUserRepository };
