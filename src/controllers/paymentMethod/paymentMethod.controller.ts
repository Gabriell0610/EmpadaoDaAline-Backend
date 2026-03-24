import { IPaymentMethodService } from "@/service/paymentMethod/IPaymentMethod.type";
import { HttpStatus } from "@/shared/constants";
import { NextFunction, Request, Response } from "express";

export class PaymentMethodController {
  constructor(private readonly paymentMethodService: IPaymentMethodService) {}

  listAllPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await this.paymentMethodService.listAllPaymentMethods();
      res.status(HttpStatus.OK).json({ message: "Método de pagamento listado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };
}
