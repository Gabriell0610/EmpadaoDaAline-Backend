import { IShippingService } from "@/service/ShippingService/IShippingService.type";
import { HttpStatus } from "@/shared/constants";
import { uuidSchema } from "@/utils/zod/schemas/id";
import { NextFunction, Request, Response } from "express";

export class ShippingController {
  constructor(private shippingService: IShippingService) {}

  calculateShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idAddress } = uuidSchema.parse(req.body);
      const userId = req.user?.id || "";
      const payload = await this.shippingService.calculateShippingByAddressUser(idAddress, userId);
      res.status(HttpStatus.OK).json({ message: "Frete calculado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };
}
