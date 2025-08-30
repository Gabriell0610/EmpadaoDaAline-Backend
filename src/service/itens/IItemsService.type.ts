import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";
import { ItemWithDescription, listActiveItem } from "@/repository/interfaces/itens.type";

type ItemWithRealWeight = Partial<listActiveItem> & {
  pesoReal: string;
};

type ItemWithRealWeightById = Partial<ItemEntity> & {
  pesoReal: string;
};


interface IItensService {
  create: (data: ItemCreateDto) => Promise<Partial<ItemDescriptionEntity>>;
  update: (data: ItemUpdateDto, itemId: string) => Promise<Partial<ItemWithDescription>>;
  listAll: () => Promise<Partial<ItemDescriptionEntity>[]>;
  inactiveItemDescription: (itemId: string) => Promise<Partial<ItemDescriptionEntity>>;
  listActiveItensDescription: () => Promise<Partial<ItemWithRealWeight>[]>;
  findItemById: (itemId: string) => Promise<ItemWithRealWeightById>;
}

export { IItensService };
