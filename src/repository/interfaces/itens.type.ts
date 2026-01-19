import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";
import { ItemDescription } from "@prisma/client";

export type itemEntity = Partial<ItemEntity>;
export type ItemWithDescription = Partial<ItemEntity> & {
  itemDescription: Partial<ItemDescription> | null;
};
export type listActiveItem = Partial<ItemDescription> & { item: Partial<ItemEntity>[] };

interface IItemsRepository {
  create: (data: ItemCreateDto) => Promise<Partial<itemEntity>>;
  update: (data: ItemUpdateDto, itemId: string) => Promise<itemEntity>;
  listAll: () => Promise<Partial<itemEntity>[]>;
  listItemById: (id: string) => Promise<ItemWithDescription | null>;
  inactiveItemDescription: (idItem: string) => Promise<Partial<ItemDescriptionEntity>>;
  listActiveItensDescription: () => Promise<listActiveItem[]>;
  findItemById: (itemId: string) => Promise<Partial<ItemEntity> | null>;
}

export { IItemsRepository };
