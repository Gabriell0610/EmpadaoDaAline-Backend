import { ItensService } from "@/service/itens/itens.service";
import { ItensController } from "./Itens.controller";
import { ItemRepository } from "@/repository/prisma/itens/itens.prisma";

const itensRepository = new ItemRepository();

const itensService = new ItensService(itensRepository);

const itensController = new ItensController(itensService);

export { itensController };
