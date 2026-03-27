import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "../interfaces/index";
import { Item, ItemDescription, StatusCart, StatusItem, TypeItem } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";

class InMemoryItensRepository implements IItemsRepository {
  findItemById!: (itemId: string) => Promise<Partial<ItemEntity | null>>;
  itensDb: Partial<Item>[] = [];
  itenDescriptionDb: Partial<ItemDescription>[] = [];
  create = async (dto: ItemCreateDto) => {
    const itemDescription: ItemDescriptionEntity = {
      id: randomUUID(),
      nome: "Empadão de frango",
      descricao: "Delicioso empadão de frango",
      image: "https://exemplo.com/imagem.jpg",
      updatedAt: new Date(),
      createdAt: new Date(),
      disponivel: dto.available,
      tipo: TypeItem.EMPADAO,
    };
    const item: ItemEntity = {
      id: randomUUID(),
      preco: dto.price as unknown as Decimal,
      createdAt: new Date(),
      updatedAt: new Date(),
      tamanho: dto.size,
      itemDescriptionId: itemDescription.id,
      precoUnitario: null,
      unidades: null,
    };

    this.itenDescriptionDb.push(itemDescription);
    this.itensDb.push(item);
    return item;
  };

  listItemById = async (id: string) => {
    const item = this.itensDb.find((i) => i.id === id);

    if (!item) return null;

    const itemDescription = this.itenDescriptionDb.find((d) => d.id === item?.itemDescriptionId) || null;

    return {
      ...item,
      itemDescription,
    };
  };

  listAll = async () => {
    const items = this.itensDb;

    return items;
  };

  update = async (data: ItemUpdateDto, itemId: string) => {
    const findItem = this.itensDb.find((item) => item.id === itemId)!;
    const findItemDescription = this.itenDescriptionDb.find((item) => item.id === findItem.itemDescriptionId)!;
    findItem.preco = data.price;
    findItem.updatedAt = new Date();
    findItemDescription.nome = data.name;
    findItemDescription.descricao = data.description;
    findItemDescription.image = data.image;

    return { ...findItem, ...findItemDescription };
  };

  listActiveItensDescription = async () => {
    const activeItemDescription = this.itenDescriptionDb.filter((desc) => desc.disponivel === StatusCart.ATIVO);

    // Mapeia cada itemDescription e associa os itens com o mesmo itemDescriptionId
    return activeItemDescription.map((desc) => {
      const itemsRelacionados = this.itensDb.filter((item) => item.itemDescriptionId === desc.id);

      return {
        ...desc,
        item: itemsRelacionados,
      };
    });
  };

  inactiveItemDescription = async (idItem: string) => {
    const findItem = this.itenDescriptionDb.find((item) => item.id === idItem)!;
    findItem.disponivel = StatusItem.INATIVO;
    return findItem;
  };
}

export { InMemoryItensRepository };
