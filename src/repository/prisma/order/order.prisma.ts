import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { prisma } from "@/libs/prisma";
import { IOrderRepository } from "@/repository/interfaces/order.type";
import { Prisma, status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class OrderRepository implements IOrderRepository {
  createOrder = async (orderDto: OrderDto, currentPrice: Decimal) => {
    return await prisma.pedido.create({
      data: {
        carrinhoId: orderDto.idCart,
        usuarioId: orderDto.idUser,
        meioPagamento: orderDto.paymentMethod,
        status: orderDto.status,
        dataAgendamento: orderDto.schedulingDate,
        horarioDeEntrega: orderDto.deliveryTime,
        enderecoId: orderDto.idAddress,
        precoTotal: currentPrice,
        observacao: orderDto?.observation,
        numeroPedido: await this.controllNumberOrder(),
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
      },
    });
  };

  changeStatusOrder = async (id: string, status: status) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: status,
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
      },
    });
  };

  updateOrder = async (id: string, order: UpdateOrderDto) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        dataAgendamento: order?.schedulingDate,
        enderecoId: order?.idAddress,
        horarioDeEntrega: order?.deliveryTime,
        meioPagamento: order?.paymentMethod,
        observacao: order?.observation,
        dataAtualizacao: new Date(),
      },
    });
  };

  cancelOrder = async (id: string) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: status.CANCELADO,
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
      },
    });
  };

  listOrdersByClientId = async (id: string) => {
    return await prisma.pedido.findMany({
      where: { usuarioId: id },
      select: this.buildSelectList(),
    });
  };

  listAllOrders = async () => {
    return await prisma.pedido.findMany({
      select: this.buildSelectList(),
    });
  };

  listOrderById = async (orderId: string) => {
    return await prisma.pedido.findUnique({ where: { id: orderId }, select: this.buildSelectList() });
  };

  private buildSelectList = (): Prisma.PedidoSelect => {
    return {
      id: true,
      numeroPedido: true,
      status: true,
      dataAgendamento: true,
      horarioDeEntrega: true,
      precoTotal: true,
      observacao: true,
      endereco: {
        select: {
          numero: true,
          bairro: true,
          cidade: true,
          estado: true,
          complemento: true,
          rua: true,
          cep: true,
        },
      },
      usuario: {
        select: {
          nome: true,
          email: true,
          telefone: true,
        },
      },
      carrinho: {
        select: {
          carrinhoItens: {
            select: {
              item: true,
            },
          },
        },
      },
    };
  };

  private async controllNumberOrder() {
    let numberOrder = await prisma.pedido.count();
    if (numberOrder <= 0) {
      numberOrder = 1;
    } else {
      numberOrder++;
    }
    return numberOrder;
  }
}

export { OrderRepository };
