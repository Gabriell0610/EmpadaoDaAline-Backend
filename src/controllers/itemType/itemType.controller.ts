import { itemTypeCreateBodySchema } from "@/domain/dto/itemType/ItemTypeDto";
import { IItemTypeService } from "@/service/itemType/IItemTypeService.type";
import { HttpStatus } from "@/shared/constants";
import { NextFunction, Request, Response } from "express";

export class ItemTypeController {
  constructor(private readonly itemTypeService: IItemTypeService) {}

  listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itemTypeService.listAll();
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = itemTypeCreateBodySchema.parse(req.body);
      const data = await this.itemTypeService.create(dto);
      res.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      next(error);
    }
  };
}
