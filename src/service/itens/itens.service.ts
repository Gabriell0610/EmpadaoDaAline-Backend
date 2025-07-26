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

  listActiveItens = async () => {
    const listActiveItem = await this.itensRepository.listActiveItens();
    const newItem = listActiveItem.map((itemDescription) => {
      const item = itemDescription.item?.map((item) => {
        if (!item.tamanho) throw new BadRequestException("Tamanho não definido para esse item");
        return {
          ...item,
          pesoReal: SizeItemDescription[item.tamanho],
        };
      });
      return {
        ...itemDescription,
        item,
      };
    });
    return newItem;
  };

  findItemById = async (itemId: string) => {
    const listActiveItem = await this.itensRepository.findItemById(itemId);
    if (!listActiveItem) throw new BadRequestException("Item não encontrado");
    if (!listActiveItem.tamanho) throw new BadRequestException("Tamanho não definido para esse item");

    const newItem = {
      ...listActiveItem,
      pesoReal: SizeItemDescription[listActiveItem.tamanho],
    };

    return newItem;
  };

  inactiveItem = async (itemId: string) => {
    const itemInactive = await this.itensRepository.inactiveItem(itemId);
    return itemInactive;
  };

  private verifyItemExist = async (itemId: string) => {
    const itemExists = await this.itensRepository.listById(itemId);

    if (!itemExists) {
      throw new BadRequestException("Item não encontrado!");
    }

    return itemExists;
  };
}

export { ItensService };
