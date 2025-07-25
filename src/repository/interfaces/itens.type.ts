import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";
import { ItemDescription } from "@prisma/client";

export type itemEntity = Partial<ItemEntity> & Partial<ItemDescription>;
export type listActiveItem = Partial<ItemDescription> & { item: Partial<ItemEntity>[] };

interface IItemsRepository {
  create: (data: ItemCreateDto) => Promise<Partial<ItemDescriptionEntity>>;
  update: (data: ItemUpdateDto, itemId: string) => Promise<itemEntity>;
  listAll: () => Promise<Partial<ItemDescriptionEntity>[]>;
  listById: (id: string) => Promise<Partial<itemEntity | null>>;
  inactiveItem: (idItem: string) => Promise<Partial<ItemDescriptionEntity>>;
  listActiveItens: () => Promise<listActiveItem[]>;
  listActiveItemById: (itemId: string) => Promise<listActiveItem | null>;
}

export { IItemsRepository };
