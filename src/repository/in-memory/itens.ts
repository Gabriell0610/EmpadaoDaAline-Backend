import { ItemCreateDto, ItemUpdateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "../interfaces/index";
import { Item, ItemDescription, StatusCart, statusItem } from "@prisma/client";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemEntity } from "@/domain/model";

class InMemoryItensRepository implements IItemsRepository {
  listActiveItemById!: (itemId: string) => Promise<Partial<ItemEntity | null>>;
  itensDb: Partial<Item>[] = [];
  itenDescriptionDb: Partial<ItemDescription>[] = [];
  create = async (dto: ItemCreateDto) => {
    const itemDescription = {
      id: randomUUID(),
      name: "Emapadão de frango",
      description: "Delicioso empadão de frango",
      image: "https://exemplo.com/imagem.jpg",
    };
    const item: Item = {
      id: randomUUID(),
      preco: dto.price as unknown as Decimal,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      disponivel: dto.available,
      tamanho: dto.size,
      itemDescriptionId: itemDescription.id,
    };

    this.itenDescriptionDb.push(itemDescription);
    this.itensDb.push(item);
    return item;
  };

  listById = async (id: string) => {
    const item = this.itensDb.find((i) => i.id === id);
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
    findItem.disponivel = data.available;
    findItem.dataAtualizacao = new Date();
    findItemDescription.nome = data.name;
    findItemDescription.descricao = data.description;
    findItemDescription.image = data.image;

    return { ...findItem, ...findItemDescription };
  };

  listActiveItens = async () => {
    const activeItem = this.itensDb.filter((item) => item.disponivel === StatusCart.ATIVO);

    return activeItem;
  };

  inactiveItem = async (idItem: string) => {
    const findItem = this.itensDb.find((item) => item.id === idItem)!;
    findItem.disponivel = statusItem.INATIVO;
    return findItem;
  };
}

export { InMemoryItensRepository };
