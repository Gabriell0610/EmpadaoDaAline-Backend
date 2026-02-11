import { ItemSize, Pedido, StatusItem, StatusOrder, TypeItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderEntity = Pedido;

export interface ReturnUpdateOrderDto {
  id: string;
  numeroPedido: number;
  precoTotal: Decimal;
  status: StatusOrder;
  observacao: string | null;
  dataAgendamento: Date;
  horarioInicio: string | null;
  horarioFim: string | null;
  metodoPagamento: {
    id: string;
    nome: string;
  };
  updatedAt: Date | null;
}

export interface ReturnUpdateOrderAdmin extends ReturnUpdateOrderDto {
  frete: Decimal;
  usuario: {
    nome: string;
    telefone: string;
    email: string;
  };
  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
  };
}

export type ListOrderByIdDto = {
  id: string;
  numeroPedido: number;
  status: StatusOrder;
  observacao: string | null;
  precoTotal: Decimal;
  frete: Decimal;
  dataAgendamento: Date | null;
  horarioInicio: string | null;
  horarioFim: string | null;
  celularCliente: string | null;
  nomeCliente: string | null;
  metodoPagamento: {
    id: string;
    nome: string;
  };

  usuario: {
    nome: string;
    telefone: string;
    email: string;
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

  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
  };
};

export type OrderCreateReturnDto = {
  id: string;
  numeroPedido: number;
  status: StatusOrder;
  createdAt: Date | null;
};

export type ListAllOrdersDto = {
  id: string;
  numeroPedido: number;
  precoTotal: Decimal | null;
  status: StatusOrder;
  observacao: string | null;
  dataAgendamento: Date;
  horarioInicio: string | null;
  horarioFim: string | null;

  metodoPagamento: {
    id: string;
    nome: string;
  };
  usuario: {
    nome: string;
    telefone: string;
    email: string;
    role: string;
  };
  carrinho: {
    id: string;
    status: string;
    valorTotal: Decimal | null;
    carrinhoItens: {
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
      id: string;
      precoAtual: Decimal;
      quantidade: number;
    }[];
  };
  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
  };
};

export interface DashboardSummaryDto {
  totalRevenue: number;
  totalOrders: number;
  orderInProgress: number;
  cancelOrders: number;
  orderDelivered: number;
}

export interface DashboardRevenueDto {
  label: string;
  value: number;
}

export interface DashboardQuickStats {
  ordersScheduledToday: number;
  deliveriesDueToday: number;
  canceledToday: number;
  totalDelivered: number;
  inProgressOrdersToday: number;
}
