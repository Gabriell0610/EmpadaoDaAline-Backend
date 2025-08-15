import { ItemUpdateDto, ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "@/repository/interfaces";
import { statusItem } from "@prisma/client";
import { prisma } from "@/libs/prisma";

class ItemRepository implements IItemsRepository {
  create = async (dto: ItemCreateDto) => {
    return await prisma.$transaction(async (tx) => {
      const itemDescription = await tx.itemDescription.create({
        data: {
          descricao: dto.description,
          nome: dto.name,
          image: dto.image,
          disponivel: dto.available,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        },
        include: {
          item: true,
        },
      });

      await tx.item.create({
        data: {
          preco: dto.price,
          tamanho: dto.size,
          itemDescriptionId: itemDescription.id,
        },
      });

      return itemDescription;
    });
  };

  listAll = async () => {
    return prisma.itemDescription.findMany();
  };

  listItemById = async (id: string) => {
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

  listActiveItensDescription = async () => {
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

  inactiveItemDescription = async (idItem: string) => {
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

  findItemById = async (itemId: string) => {
    return await prisma.item.findFirst({
      where: { id: itemId },
      select: {
        id: true,
        tamanho: true,
        preco: true,
        itemDescription: true,
      },
    });
  };
}

export { ItemRepository };
