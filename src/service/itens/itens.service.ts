import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { IItensService } from "./IItemsService.type";
import { IItemsRepository } from "@/repository/interfaces";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { SizeItemDescription } from "@/shared/constants/itemSize";

class ItensService implements IItensService {
  constructor(private itensRepository: IItemsRepository) {}

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

  listAll = async () => {
    const data = await this.itensRepository.listAll();
    return data;
  };

  listActiveItensDescription = async () => {
    const listActiveItem = await this.itensRepository.listActiveItensDescription();
    const newItem = listActiveItem.map((itemDescription) => {
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
    console.log("itens ativos",newItem)
    return newItem;
  };

  findItemById = async (itemId: string) => {
    const findActiveItem = await this.itensRepository.findItemById(itemId);
    if (!findActiveItem) throw new BadRequestException("Item não encontrado");

    const newItem = {
      ...findActiveItem,
      pesoReal: findActiveItem.tamanho ? SizeItemDescription[findActiveItem.tamanho] : ""
    };

    return newItem;
  };

  inactiveItemDescription = async (itemId: string) => {
    const itemInactive = await this.itensRepository.inactiveItemDescription(itemId);
    return itemInactive;
  };

  private verifyItemExist = async (itemId: string) => {
    const itemExists = await this.itensRepository.listItemById(itemId);

    if (!itemExists) {
      throw new BadRequestException("Item não encontrado!");
    }

    return itemExists;
  };
}

export { ItensService };
