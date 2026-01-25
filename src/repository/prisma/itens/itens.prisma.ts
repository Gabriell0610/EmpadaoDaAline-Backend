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
          tipo: dto.type,
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
        tipo: true,
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
            tipo: true,
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
        tipo: true,
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

  inactiveItemDescription = async (idItem: string) => {
    return await prisma.itemDescription.update({
      where: { id: idItem },
      data: {
        disponivel: StatusItem.INATIVO,
        updatedAt: new Date(),
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
        precoUnitario: true,
        tamanho: true,
        preco: true,
        itemDescription: true,
        itemDescriptionId: true,
        unidades: true,
      },
    });
  };
}

export { ItemRepository };
