import {  OrderCreateReturnDto, OrderEntity } from "@/domain/model/OrderEntity";
import {  OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { StatusOrder } from "@prisma/client";


interface IOrderService {
  createOrder: (order: OrderDto) => Promise<OrderCreateReturnDto>;
  updateOrder: (id: string, order: UpdateOrderDto) => Promise<Partial<OrderEntity>>;
  cancelOrder: (id: string) => Promise<{ id: string }>;
  listOrdersByClientId: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listOrdersMe: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listAllOrders: () => Promise<Partial<OrderEntity>[]>;
  listOrderById: (id: string) => Promise<Partial<OrderEntity> | null>;
  changeStatusOrder:(id: string, status: StatusOrder) => Promise<{id: string, usuarioId: string | null}>
}

export { IOrderService };
