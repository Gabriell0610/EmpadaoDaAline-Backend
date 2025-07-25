import { ItemUpdateDto, ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "@/repository/interfaces";
import { statusItem } from "@prisma/client";
import { prisma } from "@/libs/prisma";

class ItemRepository implements IItemsRepository {
  create = async (dto: ItemCreateDto) => {
    const itemDescription = await prisma.itemDescription.create({
      data: {
        descricao: dto.description,
        nome: dto.name,
        image: dto.image,
        disponivel: dto.available,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      },
    });

    return await prisma.item.create({
      data: {
        preco: dto.price,
        tamanho: dto.size,
        itemDescriptionId: itemDescription.id,
      },
      select: {
        id: true,
        preco: true,
        itemDescription: true,
      },
    });
  };

  listAll = async () => {
    return prisma.itemDescription.findMany();
  };

  listById = async (id: string) => {
    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        preco: true,
        tamanho: true,
        itemDescription: true,
      },
    });

    return item;
  };

  listActiveItens = async () => {
    return await prisma.itemDescription.findMany({
      where: { disponivel: statusItem.ATIVO },
      select: {
        id: true,
        nome: true,
        image: true,
        descricao: true,
        disponivel: true,
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
          },
        },
      },
    });
  };

  update = async (dto: ItemUpdateDto, itemId: string) => {
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        preco: dto.price,
        tamanho: dto.size,
        itemDescription: {
          update: {
            descricao: dto.description,
            nome: dto.name,
            image: dto.image,
            dataAtualizacao: new Date(),
          },
        },
      },
      select: {
        tamanho: true,
        preco: true,
        dataAtualizacao: true,
        id: true,
        itemDescription: true,
      },
    });
    return item;
  };

  inactiveItem = async (idItem: string) => {
    return await prisma.itemDescription.update({
      where: { id: idItem },
      data: {
        disponivel: statusItem.INATIVO,
        dataAtualizacao: new Date(),
      },
      select: {
        item: true,
        descricao: true,
        disponivel: true,
        image: true,
        nome: true,
        id: true,
      },
    });
  };

  listActiveItemById = async (itemId: string) => {
    return await prisma.itemDescription.findFirst({
      where: { id: itemId, disponivel: statusItem.ATIVO },
      select: {
        id: true,
        disponivel: true,
        descricao: true,
        image: true,
        nome: true,
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
          },
        },
      },
    });
  };
}

export { ItemRepository };
