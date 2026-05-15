import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { IItensService } from "./IItemsService.type";
import { IItemsRepository, listActiveItem } from "@/repository/interfaces";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { SizeItemDescription } from "@/shared/constants/itemSize";
import { StatusItem } from "@prisma/client";

class ItensService implements IItensService {
  constructor(private readonly itensRepository: IItemsRepository) {}

  create = async (dto: ItemCreateDto) => {
    const data = await this.itensRepository.create(dto);

    if (!data) {
      throw new BadRequestException("Erro ao criar item");
    }

    return data;
  };

  update = async (dto: ItemUpdateDto, itemId: string) => {
    await this.verifyItemExist(itemId);

    const updatedItem = await this.itensRepository.update(dto, itemId);

    return updatedItem;
  };

  // listAll = async () => {
  //   const data = await this.itensRepository.listAll();
  //   return data;
  // };

  listActiveItensDescription = async () => {
    const listActiveItem = await this.itensRepository.listActiveItensDescription();
    const newItem = this.returnItemWithRealWeight(listActiveItem);
    return newItem;
  };

  listAllItems = async () => {
    const listActiveItem = await this.itensRepository.listAllItens();

    const newItem = this.returnItemWithRealWeight(listActiveItem);

    return newItem;
  };

  findItemById = async (itemId: string) => {
    const findActiveItem = await this.itensRepository.findItemById(itemId);
    if (!findActiveItem) throw new BadRequestException("Item não encontrado");

    const newItem = {
      ...findActiveItem,
      pesoReal: findActiveItem.tamanho ? SizeItemDescription[findActiveItem.tamanho] : "",
    };

    return newItem;
  };

  changeStatusItem = async (itemId: string, status: string) => {
    if (status === StatusItem.ATIVO) {
      status = StatusItem.ATIVO;
    } else {
      status = StatusItem.INATIVO;
    }

    const result = await this.itensRepository.changeStatusItem(itemId, status as StatusItem);

    if (!result) {
      throw new BadRequestException("Erro ao alterar status do item, tente novamente");
    }
    return result;
  };

  private verifyItemExist = async (itemId: string) => {
    const itemExists = await this.itensRepository.listItemById(itemId);

    if (!itemExists) {
      throw new BadRequestException("Item não encontrado!");
    }

    return itemExists;
  };

  private returnItemWithRealWeight(items: listActiveItem[]) {
    const newItem = items.map((itemDescription) => {
      const item = itemDescription.item?.map((item) => {
        return {
          ...item,
          pesoReal: item.tamanho ? SizeItemDescription[item.tamanho] : "",
        };
      });
      return {
        ...itemDescription,
        item,
      };
    });

    return newItem;
  }
}

export { ItensService };
