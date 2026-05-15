import { ItemTypeCreateDto } from "@/domain/dto/itemType/ItemTypeDto";
import { IItemTypeRepository } from "@/repository/interfaces/itemType.type";
import { ConflitException } from "@/shared/error/exceptions/conflit-exception";
import { IItemTypeService } from "./IItemTypeService.type";

export class ItemTypeService implements IItemTypeService {
  constructor(private readonly itemTypeRepository: IItemTypeRepository) {}

  create = async (dto: ItemTypeCreateDto) => {
    const normalizedDto = {
      ...dto,
      nome: dto.nome.trim().toUpperCase(),
    };

    const itemTypeAlreadyExists = await this.itemTypeRepository.findByName(normalizedDto.nome);

    if (itemTypeAlreadyExists) {
      throw new ConflitException("Tipo de item já cadastrado");
    }

    return await this.itemTypeRepository.create(normalizedDto);
  };

  listAll = async () => {
    return await this.itemTypeRepository.listAll();
  };
}
