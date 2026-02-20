import {
  OrderCancelReturnDto,
  OrderCreateReturnDto,
  OrderEntity,
  ListOrderByIdDto,
  ReturnUpdateOrderDto,
  ReturnUpdateOrderAdmin,
} from "@/domain/model/OrderEntity";
import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { StatusOrder } from "@prisma/client";
import { ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { ListAllOrdersPaginated } from "@/repository/interfaces";
import { AccessProfile } from "@/shared/constants/accessProfile";

interface IOrderService {
  createOrder: (order: OrderDto, email: string, idUser: string) => Promise<OrderCreateReturnDto>;
  updateOrder: (
    id: string,
    order: UpdateOrderDto,
    requesterId: string,
    requesterRole: AccessProfile,
  ) => Promise<ReturnUpdateOrderDto>;
  adminUpdateOrder: (id: string, order: UpdateOrderDto) => Promise<ReturnUpdateOrderAdmin>;
  cancelOrder: (
    id: string,
    requesterId: string,
    requesterRole: AccessProfile,
    email: string,
  ) => Promise<OrderCancelReturnDto>;
  listOrdersByClientId: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listOrdersMe: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listAllOrders: (query: ListQueryOrdersDto) => Promise<ListAllOrdersPaginated>;
  listOrderById: (id: string, requesterId: string, requesterRole: AccessProfile) => Promise<ListOrderByIdDto>;
  changeStatusOrder: (id: string, status: StatusOrder) => Promise<{ id: string; usuarioId: string | null }>;
}

export { IOrderService };
