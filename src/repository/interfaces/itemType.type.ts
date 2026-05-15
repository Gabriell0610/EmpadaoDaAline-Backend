import { ItemTypeCreateDto } from "@/domain/dto/itemType/ItemTypeDto";
import { ItemTypeEntity } from "@/domain/model/ItemTypeEntity";

export interface IItemTypeRepository {
  create: (dto: ItemTypeCreateDto) => Promise<Pick<ItemTypeEntity, "id" | "nome">>;
  listAll: () => Promise<Pick<ItemTypeEntity, "id" | "nome">[]>;
  findByName: (nome: string) => Promise<Pick<ItemTypeEntity, "id" | "nome"> | null>;
}
