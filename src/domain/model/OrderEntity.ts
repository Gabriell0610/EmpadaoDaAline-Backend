import { Pedido, StatusOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemEntity } from "./ItemEntity";

type OrderEntity = Pedido;

export type OrderCreateReturnDto = {
  id: string;
  numeroPedido: number;
  precoTotal: Decimal;
  status: StatusOrder;
  observacao: string | null;
  dataAgendamento: Date | null;
  horarioDeEntrega: string | null;
  dataAtualizacao: Date | null;
  metodoPagamento: {
    id: string,
    nome: string
  }
  usuario: {
    id: string
    nome: string
    telefone: string
    email: string
    dataAtualizacao: Date | null
  }
  carrinho: {
    status: string;
    valorTotal: Decimal | null
    carrinhoItens: {
      id: string;
      item: ItemEntity;
      precoAtual: Decimal;
      quantidade: number;
    }[];
  } 
  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
    dataAtualizacao: Date | null
  } 
};


export { OrderEntity }

