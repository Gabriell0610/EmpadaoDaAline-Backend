import { Usuario } from "@prisma/client";

type UserEntity = Usuario;

interface UserAddressEntity {
  usuarioId: string;
  enderecoId: string;
  endereco: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
    bairro: string;
    cep: string;
    complemento: string | null;
    id: string;
  };
}

interface ListUserLoggedDto {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt: Date | null;
  role: string;
  enderecos: {
    endereco: {
      rua: string;
      numero: string;
      cidade: string;
      estado: string;
      bairro: string;
      cep: string;
      complemento: string | null;
      id: string;
    };
  }[];
}

export { UserEntity, UserAddressEntity, ListUserLoggedDto };
