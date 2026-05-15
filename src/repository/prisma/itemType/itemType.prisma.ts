import { ItemTypeCreateDto } from "@/domain/dto/itemType/ItemTypeDto";
import { prisma } from "@/libs/prisma";
import { IItemTypeRepository } from "@/repository/interfaces/itemType.type";

export class ItemTypeRepository implements IItemTypeRepository {
  create = async (dto: ItemTypeCreateDto) => {
    return await prisma.itemType.create({
      data: {
        nome: dto.nome,
      },
      select: {
        id: true,
        nome: true,
      },
    });
  };

  listAll = async () => {
    return await prisma.itemType.findMany({
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
      },
    });
  };

  findByName = async (nome: string) => {
    return await prisma.itemType.findUnique({
      where: {
        nome,
      },
      select: {
        id: true,
        nome: true,
      },
    });
  };
}
