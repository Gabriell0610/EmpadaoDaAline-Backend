import { OrderCreateReturnDto, OrderEntity, ListOrderByIdDto, ReturnUpdateOrderDto, ReturnUpdateOrderAdmin, ListAllOrdersDto, DashboardSummaryDto, DashboardRevenueDto, DashboardQuickStats } from "@/domain/model/OrderEntity";
import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { Decimal } from "@prisma/client/runtime/library";
import { StatusOrder } from "@prisma/client";
import { PaginationInterface, ListQueryOrdersDto, DashboardQueryParams } from "@/utils/zod/schemas/params";

export interface ListAllOrdersPaginated extends PaginationInterface {
  data: ListAllOrdersDto[],
}

interface IOrderRepository {
  createOrder: (orderDto: OrderDto, currentPrice: Decimal, createdBy:string) => Promise<OrderCreateReturnDto>;
  updateOrder: (id: string, order: UpdateOrderDto) => Promise<ReturnUpdateOrderDto>;
  adminUpdateOrder: (id: string, order: UpdateOrderDto, totalPrice: Decimal) => Promise<ReturnUpdateOrderAdmin>;
  cancelOrder: (id: string) => Promise<{ id: string }>;
  listOrdersByClientId: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listOrdersMe: (idClient: string) => Promise<Partial<OrderEntity>[]>;
  listAllOrders: (params: ListQueryOrdersDto) => Promise<ListAllOrdersPaginated>;
  listOrderById: (id: string) => Promise<ListOrderByIdDto | null>;
  changeStatusOrder: (id: string, status: StatusOrder) => Promise<{id: string, usuarioId: string | null}>
  updateShippingOrder: (idOrder: string, price: Decimal) => Promise<Partial<OrderEntity>>

  getDashboardSummary(query: DashboardQueryParams): Promise<DashboardSummaryDto> 
  getDashboardRevenue(query: DashboardQueryParams): Promise<DashboardRevenueDto[] | null> 
  getDashboardQuickSats(): Promise<DashboardQuickStats> 
}
export { IOrderRepository };
