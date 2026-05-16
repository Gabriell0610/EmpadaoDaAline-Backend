import { ItemTypeRepository } from "@/repository/prisma/itemType/itemType.prisma";
import { ItemTypeService } from "@/service/itemType/itemType.service";
import { ItemTypeController } from "./itemType.controller";

const itemTypeRepository = new ItemTypeRepository();
const itemTypeService = new ItemTypeService(itemTypeRepository);

export const itemTypeController = new ItemTypeController(itemTypeService);
