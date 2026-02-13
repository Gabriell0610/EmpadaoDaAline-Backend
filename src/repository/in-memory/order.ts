import { IOrderRepository, ListAllOrdersPaginated } from "@/repository/interfaces";
import {
  DashboardQuickStats,
  DashboardRevenueDto,
  DashboardSummaryDto,
  ListOrderByIdDto,
  OrderCreateReturnDto,
  OrderEntity,
  ReturnUpdateOrderAdmin,
  ReturnUpdateOrderDto,
} from "@/domain/model/OrderEntity";
import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { DashboardQueryParams, ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { Decimal } from "@prisma/client/runtime/library";
import { StatusOrder } from "@prisma/client";
import { randomUUID } from "crypto";

class InMemoryOrderRepository implements IOrderRepository {
  listAllOrders!: (params: ListQueryOrdersDto) => Promise<ListAllOrdersPaginated>;
  getDashboardSummary!: (query: DashboardQueryParams) => Promise<DashboardSummaryDto>;
  getDashboardRevenue!: (query: DashboardQueryParams) => Promise<DashboardRevenueDto[] | null>;
  ordersDb: Array<ListOrderByIdDto & { usuarioId: string; createdBy: string | null }> = [];

  createOrder = async (orderDto: OrderDto, currentPrice: Decimal, createdBy: string): Promise<OrderCreateReturnDto> => {
    const order = this.makeOrder(orderDto, currentPrice, createdBy);
    this.ordersDb.push(order);

    return {
      id: order.id,
      numeroPedido: order.numeroPedido,
      status: order.status,
      createdAt: new Date(),
    };
  };

  updateOrder = async (id: string, order: UpdateOrderDto): Promise<ReturnUpdateOrderDto> => {
    const found = this.ordersDb.find((item) => item.id === id);

    if (!found) return null as never;

    found.observacao = order.observation ?? found.observacao;
    found.dataAgendamento = order.schedulingDate ?? found.dataAgendamento;
    found.horarioInicio = order.startTime ?? found.horarioInicio;
    found.horarioFim = order.endTime ?? found.horarioFim;

    return {
      id: found.id,
      numeroPedido: found.numeroPedido,
      precoTotal: found.precoTotal,
      status: found.status,
      observacao: found.observacao,
      dataAgendamento: found.dataAgendamento!,
      horarioInicio: found.horarioInicio,
      horarioFim: found.horarioFim,
      metodoPagamento: found.metodoPagamento,
      updatedAt: new Date(),
    };
  };

  adminUpdateOrder = async (
    id: string,
    order: UpdateOrderDto,
    totalPrice: Decimal,
  ): Promise<ReturnUpdateOrderAdmin> => {
    const found = this.ordersDb.find((item) => item.id === id);

    if (!found) return null as never;

    found.precoTotal = totalPrice;
    found.frete = new Decimal(order.shipping || found.frete);

    return {
      id: found.id,
      numeroPedido: found.numeroPedido,
      precoTotal: found.precoTotal,
      status: found.status,
      observacao: found.observacao,
      dataAgendamento: found.dataAgendamento!,
      horarioInicio: found.horarioInicio,
      horarioFim: found.horarioFim,
      metodoPagamento: found.metodoPagamento,
      frete: found.frete,
      usuario: found.usuario,
      endereco: found.endereco,
      updatedAt: new Date(),
    };
  };

  cancelOrder = async (id: string): Promise<{ id: string }> => {
    const found = this.ordersDb.find((item) => item.id === id);
    if (found) found.status = StatusOrder.CANCELADO;
    return { id };
  };

  listOrdersByClientId = async (idClient: string): Promise<Partial<OrderEntity>[]> => {
    return this.ordersDb.filter((order) => order.usuarioId === idClient) as unknown as Partial<OrderEntity>[];
  };

  listOrdersMe = async (idClient: string): Promise<Partial<OrderEntity>[]> => {
    return this.ordersDb.filter((order) => order.usuarioId === idClient) as unknown as Partial<OrderEntity>[];
  };

  listOrderById = async (id: string): Promise<ListOrderByIdDto | null> => {
    return this.ordersDb.find((order) => order.id === id) || null;
  };

  changeStatusOrder = async (id: string, status: StatusOrder): Promise<{ id: string; usuarioId: string | null }> => {
    const found = this.ordersDb.find((item) => item.id === id);
    if (found) found.status = status;
    return { id, usuarioId: found?.usuarioId || null };
  };

  updateShippingOrder = async (idOrder: string, price: Decimal): Promise<Partial<OrderEntity>> => {
    const found = this.ordersDb.find((item) => item.id === idOrder);
    if (found) {
      found.frete = price;
      found.precoTotal = found.carrinho.valorTotal!.plus(price);
    }
    return (found || {}) as Partial<OrderEntity>;
  };

  getDashboardQuickSats = async (): Promise<DashboardQuickStats> => {
    return {
      ordersScheduledToday: 0,
      deliveriesDueToday: 0,
      canceledToday: 0,
      totalDelivered: 0,
      inProgressOrdersToday: 0,
    };
  };

  private makeOrder(orderDto: OrderDto, currentPrice: Decimal, createdBy: string) {
    return {
      id: randomUUID(),
      numeroPedido: this.ordersDb.length + 1,
      status: orderDto.status,
      observacao: orderDto.observation || null,
      precoTotal: currentPrice,
      frete: new Decimal(orderDto.shipping),
      dataAgendamento: orderDto.schedulingDate,
      horarioInicio: orderDto.startTime,
      horarioFim: orderDto.endTime,
      celularCliente: orderDto.cellphoneClient || null,
      nomeCliente: orderDto.nameClient || null,
      metodoPagamento: {
        id: orderDto.idPaymentMethod,
        nome: "Pix",
      },
      usuario: {
        nome: "Usuário teste",
        telefone: "00000000000",
        email: "user@example.com",
      },
      carrinho: {
        status: "ATIVO",
        valorTotal: currentPrice.minus(new Decimal(orderDto.shipping)),
        carrinhoItens: [],
      },
      endereco: {
        bairro: "Centro",
        cidade: "Cidade",
        cep: "00000000",
        complemento: null,
        estado: "SP",
        numero: "123",
        rua: "Rua Teste",
      },
      usuarioId: orderDto.idUser,
      createdBy,
    };
  }
}

export { InMemoryOrderRepository };
