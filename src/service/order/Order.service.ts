import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { IOrderService } from "./IOrderService.type";
import { ICartRepository, IOrderRepository } from "@/repository/interfaces/index";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { StatusOrder, StatusCart } from "@prisma/client";
import { OrderCancelReturnDto, OrderCreateReturnDto, OrderEntity } from "@/domain/model";
import { Decimal } from "@prisma/client/runtime/library";
import { ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { isBefore, startOfDay, parse, isValid } from "date-fns";
import { AccessProfile } from "@/shared/constants/accessProfile";
import { ForbiddenException } from "@/shared/error/exceptions/forbiddenException";
import { createLogger } from "@/libs/logger";
import { IEmailService } from "../email/email.type";
import { prisma } from "@/libs/prisma";

const orderServiceLogger = createLogger("order-service");

class OrderService implements IOrderService {
  private readonly adminEmails = [process.env.ADMIN_EMAIL!, process.env.SECOND_ADMIN_EMAIL!];
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    private readonly emailService: IEmailService,
  ) {}
  listOrdersByClientId!: (idClient: string) => Promise<Partial<OrderEntity>[]>;

  createOrder = async (orderDto: OrderDto, emailUser: string, idUser: string) => {
    const cart = await this.cartRepository.findCartActiveByUser(idUser);

    if (!cart?.valorTotal) {
      throw new BadRequestException("carrinho não encontrado");
    }

    this.validateScheduling(orderDto);
    this.validatedPromptDelivery(orderDto.schedulingDate);

    const shipping = new Decimal(orderDto.shipping);
    const totalPrice = cart.valorTotal.plus(shipping);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await this.orderRepository.createOrder(tx, orderDto, totalPrice, emailUser, idUser, cart.id);

      await this.cartRepository.changeStatusCart(tx, cart.id, StatusCart.FINALIZADO);

      return createdOrder;
    });

    orderServiceLogger.info(
      {
        orderId: order.id,
        userId: idUser,
        cartId: cart.id,
        totalPrice: totalPrice.toString(),
      },
      "Order created",
    );

    if (order.status === StatusOrder.PENDENTE) {
      this.emailService
        .sendEmail({
          to: emailUser,
          template: "ORDER_CREATED",
          data: this.buildOrderEmailData(order),
        })
        .catch((error) => {
          orderServiceLogger.error({ err: error, userId: idUser }, "Failed to send order created email");
        });

      this.adminEmails.forEach((email) => {
        this.emailService
          .sendEmail({
            to: email,
            template: "NEW_ORDER_ADMIN",
            data: this.buildOrderEmailData(order),
          })
          .catch((error) => {
            orderServiceLogger.error({ err: error, userId: idUser }, "Failed to send order created email admin");
          });
      });
    }

    return order;
  };

  updateOrder = async (id: string, order: UpdateOrderDto, requesterId: string, requesterRole: AccessProfile) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    await this.verifyOrderExists(id);
    const updatedOrder = await this.orderRepository.updateOrder(id, order);

    if (!updatedOrder) {
      throw new BadRequestException("Não foi possível editar o seu pedido!");
    }

    orderServiceLogger.info({ orderId: id, requesterId, requesterRole }, "Order updated by requester");
    return updatedOrder;
  };

  adminUpdateOrder = async (id: string, orderDto: UpdateOrderDto) => {
    const order = await this.verifyOrderExists(id);

    let totalPrice = order.precoTotal;
    if (orderDto.shipping !== undefined) {
      const currentWithoutShipping = order.precoTotal.minus(order.frete);
      const newShipping = new Decimal(orderDto.shipping);
      totalPrice = currentWithoutShipping.plus(newShipping);
    }

    const updatedOrder = await this.orderRepository.adminUpdateOrder(id, orderDto, totalPrice);

    if (!updatedOrder) {
      throw new BadRequestException("Não foi possível editar o pedido");
    }

    orderServiceLogger.info({ orderId: id, totalPrice: totalPrice.toString() }, "Order updated by admin");
    return updatedOrder;
  };

  cancelOrder = async (id: string, requesterId: string, requesterRole: AccessProfile) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    const order = await this.verifyOrderExists(id);

    if (order.status === StatusOrder.CANCELADO) {
      throw new BadRequestException("Pedido já está cancelado");
    }

    const todayStamp = this.getLocalDateStamp(new Date());
    const deliveryStamp = this.getUtcDateStamp(order.dataAgendamento!);

    if (todayStamp >= deliveryStamp) {
      throw new BadRequestException("Voce só pode cancelar o pedido ate o dia anterior da data de entrega");
    }

    const payload = await this.orderRepository.cancelOrder(id);

    this.emailService
      .sendEmail({
        to: order.usuario.email,
        template: "ORDER_CANCELED",
        data: this.buildOrderEmailData(payload),
      })
      .catch((error) => {
        orderServiceLogger.error({ err: error, userId: requesterId, orderId: id }, "Failed to send order cancel email");
      });

    orderServiceLogger.info({ orderId: id, requesterId, requesterRole }, "Order cancelled");
    return payload;
  };

  clientConfirmOrder = async (id: string, requesterId: string, requesterRole: AccessProfile, emailUser: string) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    const order = await this.verifyOrderExists(id);

    if (order.status === StatusOrder.CANCELADO) {
      throw new BadRequestException("Pedido já está cancelado");
    }

    if (order.status === StatusOrder.CONFIRMADO_CLIENTE) {
      throw new BadRequestException("Pedido já foi confirmado pelo cliente");
    }

    const payload = await this.orderRepository.clientConfirmOrder(id);

    try {
      await this.emailService.sendEmail({
        to: emailUser,
        template: "ORDER_CONFIRMED",
        data: this.buildOrderEmailData(payload),
      });
    } catch (error) {
      orderServiceLogger.error({ err: error, userId: requesterId, orderId: id }, "Failed to send order confirm email");
      throw error;
    }

    orderServiceLogger.info({ orderId: id, requesterId, requesterRole }, "Order confirmed");
    return payload;
  };

  listOrdersMe = async (idClient: string) => {
    const orderByClient = await this.orderRepository.listOrdersMe(idClient);
    return orderByClient;
  };

  listAllOrders = async (params: ListQueryOrdersDto) => {
    const allOrders = await this.orderRepository.listAllOrders(params);
    orderServiceLogger.debug(
      { page: params.page, size: params.size, status: params.status },
      "Orders listed with filters",
    );
    return allOrders;
  };

  listOrderById = async (id: string, requesterId: string, requesterRole: AccessProfile) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    const order = await this.orderRepository.listOrderById(id);

    if (!order) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return order;
  };

  changeStatusOrder = async (id: string, status: StatusOrder) => {
    await this.verifyOrderExists(id);

    const payload = await this.orderRepository.changeStatusOrder(id, status);
    orderServiceLogger.info({ orderId: id, status, userId: payload.usuarioId }, "Order status changed");
    return payload;
  };

  private async verifyOrderExists(id: string) {
    const orderExists = await this.orderRepository.listOrderById(id);
    if (!orderExists) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return orderExists;
  }

  private async ensureOrderOwnership(orderId: string, requesterId: string, requesterRole: AccessProfile) {
    if (requesterRole === AccessProfile.ADMIN) {
      return;
    }

    if (!requesterId) {
      throw new ForbiddenException("Voce não tem permissão para executar esta acão.");
    }

    const owner = await this.orderRepository.findOrderOwnerById(orderId);

    if (!owner) {
      throw new BadRequestException("Pedido não encontrado");
    }

    if (owner.usuarioId !== requesterId) {
      throw new ForbiddenException("Voce não tem permissão para executar esta acão.");
    }
  }

  private validateScheduling(orderDto: OrderDto) {
    const schedulingDate = orderDto.schedulingDate;

    if (!isValid(schedulingDate)) {
      throw new BadRequestException("Data de agendamento inválida");
    }

    const today = startOfDay(new Date());

    if (isBefore(schedulingDate, today)) {
      throw new BadRequestException("A data de entrega não pode ser anterior a data de hoje");
    }

    const startTime = parse(orderDto.startTime, "HH:mm", new Date());
    const endTime = parse(orderDto.endTime, "HH:mm", new Date());

    if (!isValid(startTime) || !isValid(endTime)) {
      throw new BadRequestException("Horário inválido");
    }

    const minTime = parse("07:00", "HH:mm", new Date());
    const maxTime = parse("18:00", "HH:mm", new Date());

    if (isBefore(startTime, minTime) || isBefore(maxTime, endTime)) {
      throw new BadRequestException("Horário fora da janela permitida (07:00 às 18:00)");
    }
    if (endTime < startTime) {
      throw new BadRequestException("O horário final deve ser maior que o inicial");
    }
  }

  private validatedPromptDelivery(schedulingDate: Date) {
    const now = new Date();

    // Hora atual em Brasília
    const currentHourBrasilia = parseInt(
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        hour12: false,
      }).format(now),
      10,
    );

    // "Hoje" em Brasília como string YYYY-MM-DD para comparar
    const todayBrasiliaStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo", // en-CA formata como YYYY-MM-DD
    }).format(now);

    console.log("schedulingDate recebido:", schedulingDate);
    console.log("schedulingStr:", schedulingDate.toISOString().slice(0, 10));
    console.log("todayBrasiliaStr:", todayBrasiliaStr);

    // schedulingDate veio como "2025-04-11T00:00:00" (sem tz), pega só a data
    const schedulingStr = schedulingDate.toISOString().slice(0, 10);

    const orderIsToday = schedulingStr === todayBrasiliaStr;

    console.log("Horario de brasilia: ", currentHourBrasilia);
    console.log("data de hoje", orderIsToday);

    if (orderIsToday && currentHourBrasilia >= 12) {
      throw new BadRequestException("Não é possível pedir pronta entrega após as 12h. Agende para amanhã ou depois");
    }
  }

  private buildOrderEmailData(order: OrderCreateReturnDto | OrderCancelReturnDto) {
    return {
      orderNumber: order.numeroPedido,
      orderStatus: order.status,
      createdAt: order.createdAt,
      deliveryDate: order.dataAgendamento,
      totalPrice: order.precoTotal,
      frete: order.frete,
      observacao: order.observacao,
      telefone: order.usuario.telefone,
      email: order.usuario.email,
      nomeCliente: order.nomeCliente,
      celularCliente: order.celularCliente,
      metodoPagamento: order.metodoPagamento.nome,
      items: order.carrinho.carrinhoItens.map((cartItem) => ({
        name: cartItem.item.itemDescription?.nome || "Item sem nome",
        quantity: cartItem.quantidade,
        price: cartItem.precoAtual,
        unity: cartItem.item.unidades,
      })),
    };
  }

  private getLocalDateStamp(date: Date) {
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  private getUtcDateStamp(date: Date) {
    return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
  }
}

export { OrderService };
