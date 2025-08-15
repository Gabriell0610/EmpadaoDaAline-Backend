import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "../interfaces/index";
import { Item, ItemDescription, StatusCart, statusItem } from "@prisma/client";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemDescriptionEntity, ItemEntity } from "@/domain/model";

class InMemoryItensRepository implements IItemsRepository {
  findItemById!: (itemId: string) => Promise<Partial<ItemEntity | null>>;
  itensDb: Partial<Item>[] = [];
  itenDescriptionDb: Partial<ItemDescription>[] = [];
  create = async (dto: ItemCreateDto) => {
    const itemDescription: ItemDescriptionEntity = {
      id: randomUUID(),
      nome: "Emapadão de frango",
      descricao: "Delicioso empadão de frango",
      image: "https://exemplo.com/imagem.jpg",
      dataAtualizacao: new Date(),
      dataCriacao: new Date(),
      disponivel: dto.available,
    };
    const item: ItemEntity = {
      id: randomUUID(),
      preco: dto.price as unknown as Decimal,
      dataAtualizacao: new Date(),
      tamanho: dto.size,
      itemDescriptionId: itemDescription.id,
    };

    this.itenDescriptionDb.push(itemDescription);
    this.itensDb.push(item);
    return item;
  };

  listItemById = async (id: string) => {
    const item = this.itensDb.find((i) => i.id === id);
    console.log("ITEM ENCONTRADO", item);
    return item ?? null;
  };

  listAll = async () => {
    const items = this.itensDb;

    return items;
  };

  update = async (data: ItemUpdateDto, itemId: string) => {
    const findItem = this.itensDb.find((item) => item.id === itemId)!;
    const findItemDescription = this.itenDescriptionDb.find((item) => item.id === findItem.itemDescriptionId)!;
    findItem.preco = data.price;
    findItem.dataAtualizacao = new Date();
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
    findItem.disponivel = statusItem.INATIVO;
    return findItem;
  };
}

export { InMemoryItensRepository };
