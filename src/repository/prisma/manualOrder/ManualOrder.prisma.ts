import { ManualOrderDto, UpdateManualOrderDto } from "@/domain/dto/manualOrder/ManualOrder";
import { prisma } from "@/libs/prisma";
import { IManualOrderRepository } from "@/repository/interfaces/manualOrder.type";
import { status as PedidoStatus } from "@prisma/client";

class ManualOrderRepository implements IManualOrderRepository {
  createManualOrder = async (dto: ManualOrderDto) => {
    return await prisma.pedidoManual.create({
      data: {
        enderecoCliente: dto.addressClient,
        meioPagamento: dto.paymentMethod,
        nomeCliente: dto.clientName,
        telefoneCliente: dto.cellphoneClient,
        precoTotal: dto.totalPrice,
        observacao: dto.observation,
        dataAgendamento: dto.schedulingDate,
        horarioDeEntrega: dto.deliveryTime,
        status: dto.status,
        numeroPedido: await this.controllNumberOrder(),
        pedidoManualItem: {
          create: dto.products.map((data) => ({
            quantidade: data.quantity,
            itemId: data.itemId,
          })),
        },
      },
      select: {
        id: true,
        dataAgendamento: true,
        horarioDeEntrega: true,
        numeroPedido: true,
        status: true,
        dataCriacao: true,
        dataAtualizacao: true,
        meioPagamento: true,
        precoTotal: true,
        observacao: true,
        telefoneCliente: true,
        nomeCliente: true,
        pedidoManualItem: {
          select: {
            itemId: true,
            quantidade: true,
            id: true,
          },
        },
      },
    });
  };

  removeItemManualOrder = async (id: string) => {
    await prisma.pedidoManualItem.delete({ where: { id: id } });
  };

  changeStatusOrder = async (id: string, status: PedidoStatus, mode: string | undefined) => {
    if (mode && mode === "cancel") {
      return await prisma.pedidoManual.update({
        where: { id: id },
        data: {
          status: PedidoStatus.CANCELADO,
          dataAtualizacao: new Date(),
        },
        select: {
          id: true,
        },
      });
    }

    return await prisma.pedidoManual.update({
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

  updateManualOrder = async (id: string, dto: UpdateManualOrderDto) => {
    const products = dto.products ? dto.products : [];

    return await prisma.pedidoManual.update({
      where: { id: id },
      data: {
        dataAgendamento: dto?.schedulingDate,
        enderecoCliente: dto?.addressClient,
        horarioDeEntrega: dto?.deliveryTime,
        meioPagamento: dto?.paymentMethod,
        nomeCliente: dto?.clientName,
        telefoneCliente: dto?.cellphoneClient,
        precoTotal: dto?.totalPrice,
        observacao: dto?.observation,
        dataAtualizacao: new Date(),
        pedidoManualItem: {
          update: products
            .filter((data) => !!data.idManualOrderItem) // Se tem ID → update
            .map((data) => ({
              where: { id: data.idManualOrderItem },
              data: {
                quantidade: data.quantity,
                itemId: data.itemId,
              },
            })),
          create: products
            .filter((data) => !data.idManualOrderItem) // Se não tem ID → create
            .map((data) => ({
              quantidade: data.quantity,
              itemId: data.itemId,
            })),
        },
      },
      select: {
        id: true,
      },
    });
  };

  findManualOrderById = async (id: string) => {
    return await prisma.pedidoManual.findUnique({
      where: { id: id },
      select: {
        id: true,
        dataAgendamento: true,
        horarioDeEntrega: true,
        numeroPedido: true,
        status: true,
        dataCriacao: true,
        dataAtualizacao: true,
        meioPagamento: true,
        precoTotal: true,
        observacao: true,
        telefoneCliente: true,
        nomeCliente: true,
        pedidoManualItem: {
          select: {
            itemId: true,
            quantidade: true,
            id: true,
          },
        },
      },
    });
  };

  listAllManualOrder = async () => {
    return await prisma.pedidoManual.findMany({
      select: {
        id: true,
        dataAgendamento: true,
        horarioDeEntrega: true,
        numeroPedido: true,
        status: true,
        dataCriacao: true,
        dataAtualizacao: true,
        meioPagamento: true,
        precoTotal: true,
        observacao: true,
        telefoneCliente: true,
        nomeCliente: true,
        pedidoManualItem: {
          select: {
            quantidade: true,
            id: true,
            item: true,
          },
        },
        enderecoCliente: true
      },
    });
  };

  private async controllNumberOrder() {
    let numberOrder = await prisma.pedidoManual.count();
    if (numberOrder <= 0) {
      numberOrder = 1;
    } else {
      numberOrder++;
    }
    return numberOrder;
  }
}

export { ManualOrderRepository };
