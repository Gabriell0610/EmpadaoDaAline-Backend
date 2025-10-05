import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { IOrderService } from "./IOrderService.type";
import { ICartRepository, IItemsRepository, IOrderRepository } from "@/repository/interfaces/index";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { status } from "@prisma/client";

class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
    private readonly itemRepository: IItemsRepository,
  ) {}

  createOrder = async (orderDto: OrderDto) => {
    const cart = await this.cartRepository.findCartActiveByUser(orderDto.idUser);
    if (!cart || !cart.valorTotal) {
      throw new BadRequestException("carrinho não enontrado");
    }

    const order = await this.orderRepository.createOrder(orderDto, cart.valorTotal);

    await this.cartRepository.changeStatusCart(cart.id || "");

    return order;
  };

  updateOrder = async (id: string, order: UpdateOrderDto) => {
    await this.verifyOrderExists(id);
    const updatedOrder = await this.orderRepository.updateOrder(id, order);

    if (!updatedOrder) {
      throw new BadRequestException("valor não enviado");
    }

    return updatedOrder;
  };

  cancelOrder = async (id: string) => {
    await this.verifyOrderExists(id);
    const canceledOrder = await this.orderRepository.cancelOrder(id);

    return canceledOrder;
  };

  listOrdersByClientId = async (idClient: string) => {
    const orderByClient = await this.orderRepository.listOrdersByClientId(idClient);
    if(orderByClient && orderByClient.length === 0) {
      throw new BadRequestException("Usuário não possui nenhum pedido")
    }
    return orderByClient;
  };

  listOrdersMe = async (idClient: string) => {
     const orderByClient = await this.orderRepository.listOrdersMe(idClient);
     if(orderByClient && orderByClient.length === 0) {
      throw new BadRequestException("Você não possui nenhum pedido")
    }
    return orderByClient;
  }

  listAllOrders = async () => {
    const allOrders = await this.orderRepository.listAllOrders();
    return allOrders;
  };

  listOrderById = async (id: string) => {
    const order = await this.orderRepository.listOrderById(id);

    if (!order) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return order;
  };

  changeStatusOrder = async (id: string, status: status) => {
    await this.verifyOrderExists(id);

    const data = this.orderRepository.changeStatusOrder(id, status);

    return data;
  };

  private verifyOrderExists = async (id: string) => {
    const orderExists = await this.orderRepository.listOrderById(id);
    if (!orderExists) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return orderExists;
  };
}

export { OrderService };
