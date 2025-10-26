import {ManualOrderAndItemEntity, ManualOrderWithItems } from "@/domain/model/manualOrderEntity";
import { StatusOrder } from "@prisma/client";
import { ManualOrderDto, UpdateManualOrderDto } from "@/domain/dto/manualOrder/ManualOrder";


interface IManualOrderRepository {
  listAllManualOrder:() => Promise<Partial<ManualOrderAndItemEntity>[]>
  changeStatusOrder: (id: string, status: StatusOrder, mode?: string) => Promise<{id: string}>
  createManualOrder: (dto: ManualOrderDto) => Promise<Partial<ManualOrderAndItemEntity>>
  findManualOrderById:(id: string) => Promise<Partial<ManualOrderWithItems | null>>
  updateManualOrder: (id: string, dto: UpdateManualOrderDto) => Promise<{id: string}>
  removeItemManualOrder: (id: string) => Promise<void>
}
export { IManualOrderRepository };
