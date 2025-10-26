import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { StatusOrder } from "@prisma/client";
import { IManualOrderService } from "./IManualOrderService.type";
import { ManualOrderDto, UpdateManualOrderDto } from "@/domain/dto/manualOrder/ManualOrder";
import { IItemsRepository } from "@/repository/interfaces/itens.type";
import { IManualOrderRepository } from "@/repository/interfaces/manualOrder.type";

class ManualOrderService implements IManualOrderService {
  constructor(
    private readonly manualOrderRepository: IManualOrderRepository,
    private readonly itemRepository: IItemsRepository,
  ) {}

  listAllManualOrder = async () => {
    const result = await this.manualOrderRepository.listAllManualOrder();

    return result;
  };

  createManualOrder = async (dto: ManualOrderDto) => {
    const result = await this.manualOrderRepository.createManualOrder(dto);

    return result;
  };

  changeStatusOrder = async (id: string, status: StatusOrder, mode?: string) => {
    await this.verifyOrderExists(id);

    const result = this.manualOrderRepository.changeStatusOrder(id, status, mode);

    return result;
  };

  updateManualOrder = async (id: string, dto: UpdateManualOrderDto) => {
    await this.verifyOrderExists(id);
    const result = await this.manualOrderRepository.updateManualOrder(id, dto);
    const data = await this.verifyOrderExists(result.id);

    console.log(data?.pedidoManualItem);
    if (data?.pedidoManualItem && data?.pedidoManualItem?.length === 0) {
      throw new BadRequestException("Pedido não pode ficar sem item, adicione um item para esse pedido");
    }

    return result;
  };

  removeItemManualOrder = async (id: string) => {
    await this.manualOrderRepository.removeItemManualOrder(id);
  };

  private verifyOrderExists = async (id: string) => {
    const orderExists = await this.manualOrderRepository.findManualOrderById(id);
    if (!orderExists) {
      throw new BadRequestException("Pedido não encontrado");
    }

    return orderExists;
  };
}

export { ManualOrderService };
