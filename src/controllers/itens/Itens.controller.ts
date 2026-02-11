import { HttpStatus } from "@/shared/constants/index";
import { itemCreateBodySchema, itemUpdateBodySchema } from "@/domain/dto/itens/ItensDto";
import { IItensService } from "@/service/itens/IItemsService.type";
import { NextFunction, Request, Response } from "express";

class ItensController {
  constructor(private itensService: IItensService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = itemCreateBodySchema.parse(req.body);
      const data = await this.itensService.create(dto);
      res.status(HttpStatus.CREATED).json({ message: "Item criado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itensService.listAll();
      res.status(HttpStatus.OK).json({ message: "Listando itens", data: data });
    } catch (error) {
      next(error);
    }
  };

  listActiveItensDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itensService.listActiveItensDescription();
      res.status(HttpStatus.OK).json({ message: "Listando itens ativos", data: data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = itemUpdateBodySchema.parse(req.body);
      console.log("Tem que cair nesse DTO: ", dto);
      const { id: itemId } = req.params;
      const data = await this.itensService.update(dto, itemId);
      console.log("deu ruim não caiu aqui");
      res.status(HttpStatus.CREATED).json({ message: "Item atualizado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  inactiveItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: itemId } = req.params;
      const data = await this.itensService.inactiveItemDescription(itemId);
      res.status(HttpStatus.OK).json({ message: "Item inativado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  listItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: itemId } = req.params;
      const data = await this.itensService.findItemById(itemId);
      res.status(HttpStatus.OK).json({ message: "item listado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };
}

export { ItensController };
