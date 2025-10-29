import { OrderCreateReturnDto, OrderEntity } from "@/domain/model/OrderEntity";
import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { Decimal } from "@prisma/client/runtime/library";
import { StatusOrder } from "@prisma/client";

interface IOrderRepository {
  createOrder: (orderDto: OrderDto, currentPrice: Decimal) => Promise<OrderCreateReturnDto>;
  updateOrder: (id: string, order: UpdateOrderDto) => Promise<Partial<OrderEntity>>;
  cancelOrder: (id: string) => Promise<{ id: string }>;
  listOrdersByClientId: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listOrdersMe: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listAllOrders: () => Promise<Partial<OrderEntity>[]>;
  listOrderById: (id: string) => Promise<Partial<OrderEntity> | null>;
  changeStatusOrder: (id: string, status: StatusOrder) => Promise<{id: string, usuarioId: string | null}>
  updateShippingOrder: (idOrder: string, price: Decimal) => Promise<Partial<OrderEntity>>
}
export { IOrderRepository };
