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
  horarioInicio: string | null;
  horarioFim: string| null;
  metodoPagamento: {
    nome: string
  }
  usuario: {
    nome: string
    telefone: string
    email: string
  }
  carrinho: {
    status: string;
    valorTotal: Decimal | null
    carrinhoItens: {
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
  } 
};


export { OrderEntity }

