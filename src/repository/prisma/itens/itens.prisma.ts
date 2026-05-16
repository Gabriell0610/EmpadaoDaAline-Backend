import { ItemUpdateDto, ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { IItemsRepository } from "@/repository/interfaces";
import { StatusItem } from "@prisma/client";
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
          createdAt: new Date(),
          updatedAt: new Date(),
          itemType: {
            connect: { id: dto.itemTypeId },
          },
        },
        include: {
          item: true,
        },
      });

      await tx.item.create({
        data: {
          preco: dto.price,
          tamanho: dto.size,
          precoUnitario: dto.unitPrice,
          unidades: dto.unity,
          itemDescriptionId: itemDescription.id,
        },
      });

      return itemDescription;
    });
  };

  listAll = async () => {
    return await prisma.itemDescription.findMany({
      select: {
        id: true,
        nome: true,
        image: true,
        descricao: true,
        disponivel: true,
        itemType: { select: { id: true, nome: true } },
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
            unidades: true,
            precoUnitario: true,
          },
        },
      },
    });
  };

  listItemById = async (id: string) => {
    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        preco: true,
        tamanho: true,
        unidades: true,
        itemDescription: {
          select: {
            nome: true,
            itemType: { select: { id: true, nome: true } },
            id: true,
            descricao: true,
            disponivel: true,
            image: true,
          },
        },
        carrinhoItens: true,
        updatedAt: true,
        precoUnitario: true,
      },
    });

    return item;
  };

  listActiveItensDescription = async () => {
    return await prisma.itemDescription.findMany({
      where: { disponivel: StatusItem.ATIVO },
      select: {
        id: true,
        nome: true,
        image: true,
        descricao: true,
        disponivel: true,
        itemType: { select: { id: true, nome: true } },
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
            unidades: true,
            precoUnitario: true,
          },
        },
      },
    });
  };

  listAllItens = async () => {
    return await prisma.itemDescription.findMany({
      select: {
        id: true,
        nome: true,
        image: true,
        descricao: true,
        disponivel: true,
        itemType: { select: { id: true, nome: true } },
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
            unidades: true,
            precoUnitario: true,
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
        precoUnitario: dto.unitPrice,
        itemDescription: {
          update: {
            descricao: dto.description,
            nome: dto.name,
            image: dto.image,
            updatedAt: new Date(),
            ...(dto.itemTypeId && {
              itemType: {
                connect: { id: dto.itemTypeId },
              },
            }),
          },
        },
      },
      select: {
        tamanho: true,
        preco: true,
        updatedAt: true,
        id: true,
        itemDescription: true,
        precoUnitario: true,
      },
    });
    return item;
  };

  changeStatusItem = async (idItem: string, status: StatusItem) => {
    return await prisma.item.update({
      where: { id: idItem },
      data: {
        itemDescription: {
          update: {
            disponivel: status,
          },
        },
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  };

  findItemById = async (itemId: string) => {
    return await prisma.item.findFirst({
      where: { id: itemId },
      select: {
        id: true,
        precoUnitario: true,
        tamanho: true,
        preco: true,
        itemDescription: {
          include: {
            itemType: true,
          },
        },
        itemDescriptionId: true,
        unidades: true,
      },
    });
  };

  findItemDescriptionById = async (id: string) => {
    return await prisma.itemDescription.findFirst({
      where: { id: id },
      select: {
        disponivel: true,
        image: true,
        id: true,
        itemType: { select: { id: true, nome: true } },
        nome: true,
        descricao: true,
        item: true,
        createdAt: false,
        updatedAt: false,
      },
    });
  };
}

export { ItemRepository };
