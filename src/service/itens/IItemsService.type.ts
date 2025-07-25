import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";
import { listActiveItem } from "@/repository/interfaces/itens.type";

type ItemWithRealWeight = Partial<listActiveItem> & {
  pesoReal: string;
};

interface IItensService {
  create: (data: ItemCreateDto) => Promise<Partial<ItemDescriptionEntity>>;
  update: (data: ItemUpdateDto, itemId: string) => Promise<Partial<ItemEntity>>;
  listAll: () => Promise<Partial<ItemDescriptionEntity>[]>;
  inactiveItem: (itemId: string) => Promise<Partial<ItemDescriptionEntity>>;
  listActiveItens: () => Promise<Partial<ItemWithRealWeight>[]>;
  listActiveItemById: (itemId: string) => Promise<Partial<ItemWithRealWeight>>;
}

export { IItensService };
