import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { IOrderService } from "./IOrderService.type";
import { ICartRepository, IOrderRepository } from "@/repository/interfaces/index";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { StatusOrder, StatusCart } from "@prisma/client";
import { OrderEntity } from "@/domain/model";
import { Decimal } from "@prisma/client/runtime/library";
import { ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { isBefore, startOfDay, parse, isValid, getHours, isToday } from "date-fns";
import { AccessProfile } from "@/shared/constants/accessProfile";
import { ForbiddenException } from "@/shared/error/exceptions/forbiddenException";

class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
  ) {}
  listOrdersByClientId!: (idClient: string) => Promise<Partial<OrderEntity>[]>;

  createOrder = async (orderDto: OrderDto, createdBy: string, idUser: string) => {
    const cart = await this.cartRepository.findCartActiveByUser(idUser);

    if (!cart || !cart.valorTotal) {
      throw new BadRequestException("carrinho não encontrado");
    }

    this.validateScheduling(orderDto);
    this.validatedPromptDelivery(orderDto.schedulingDate);

    const shipping = new Decimal(orderDto.shipping);
    const totalPrice = cart.valorTotal.plus(shipping);

    const order = await this.orderRepository.createOrder(orderDto, totalPrice, createdBy, idUser, cart.id);

    await this.cartRepository.changeStatusCart(cart.id || "", StatusCart.FINALIZADO);

    return order;
  };

  updateOrder = async (id: string, order: UpdateOrderDto, requesterId: string, requesterRole: AccessProfile) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    await this.verifyOrderExists(id);
    const updatedOrder = await this.orderRepository.updateOrder(id, order);

    if (!updatedOrder) {
      throw new BadRequestException("Não foi possível editar o seu pedido!");
    }

    return updatedOrder;
  };

  adminUpdateOrder = async (id: string, orderDto: UpdateOrderDto) => {
    const order = await this.verifyOrderExists(id);

    let currentPrice: Decimal = order.precoTotal;
    if (order.frete !== new Decimal(orderDto.shipping!)) {
      currentPrice = order.precoTotal.minus(order.frete);
    }

    const newShipping = new Decimal(orderDto.shipping!);
    const totalPrice = currentPrice.plus(newShipping);
    const updatedOrder = await this.orderRepository.adminUpdateOrder(id, orderDto, totalPrice);

    if (!updatedOrder) {
      throw new BadRequestException("N�o foi poss�vel editar o pedido");
    }

    return updatedOrder;
  };

  cancelOrder = async (id: string, requesterId: string, requesterRole: AccessProfile) => {
    await this.ensureOrderOwnership(id, requesterId, requesterRole);
    const order = await this.verifyOrderExists(id);

    const currentDate = new Date();
    const oneDayInMs: number = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor((order.dataAgendamento!.getTime() - currentDate.getTime()) / oneDayInMs);

    if (order.status === StatusOrder.CANCELADO) {
      throw new BadRequestException("Pedido já está cancelado");
    }

    if (differenceInDays != 1) {
      throw new BadRequestException("Você só pode cancelar o pedido até 24h antes da data agendada");
    }

    return await this.orderRepository.cancelOrder(id);
  };

  listOrdersMe = async (idClient: string) => {
    const orderByClient = await this.orderRepository.listOrdersMe(idClient);
    if (orderByClient && orderByClient.length === 0) {
      throw new BadRequestException("Você não possui nenhum pedido");
    }
    return orderByClient;
  };

  listAllOrders = async (params: ListQueryOrdersDto) => {
    const allOrders = await this.orderRepository.listAllOrders(params);
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

    return this.orderRepository.changeStatusOrder(id, status);
  };

  private verifyOrderExists = async (id: string) => {
    const orderExists = await this.orderRepository.listOrderById(id);
    if (!orderExists) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return orderExists;
  };

  private ensureOrderOwnership = async (orderId: string, requesterId: string, requesterRole: AccessProfile) => {
    if (requesterRole === AccessProfile.ADMIN) {
      return;
    }

    if (!requesterId) {
      throw new ForbiddenException("Voce nao tem permissao para executar esta acao.");
    }

    const owner = await this.orderRepository.findOrderOwnerById(orderId);

    if (!owner) {
      throw new BadRequestException("Pedido n�o encontrado");
    }

    if (owner.usuarioId !== requesterId) {
      throw new ForbiddenException("Voce nao tem permissao para executar esta acao.");
    }
  };

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

  private validatedPromptDelivery(dataEntrega: Date) {
    const now = new Date();
    const currentHours = getHours(now);

    const orderIsToday = isToday(dataEntrega);

    if (orderIsToday && currentHours >= 12) {
      throw new BadRequestException("Não é possível pedir pronta entrega após as 12h. Agende para amanhã ou depois");
    }
  }
}

export { OrderService };
