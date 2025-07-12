import { HttpStatus } from "@/shared/constants/index";
import { createCartSchema } from "@/domain/dto/cart/CreateCartDto";
import { ICartService } from "@/service/cart/ICartService.type";
import { authorizationBodySchema } from "@/utils/zod/schemas/token";
import { NextFunction, Request, Response } from "express";

class CartController {
  constructor(private cartService: ICartService) {}

  createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createCartSchema.parse(req.body);
      const data = await this.cartService.createCart(dto);
      res.status(HttpStatus.CREATED).json({ message: "Carrinho criado/item inserido com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  listCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId } = authorizationBodySchema.parse(req.body);
      const data = await this.cartService.listCartWithTotalPrice(requesterId);
      res.status(HttpStatus.OK).json({ message: "Listando carrinho com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  //TESTAR O ID VINDO DO REQ.BODY - SE DER B.O MUDAR PARA VIR DO FRONT
  incremetItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      await this.cartService.changeItemQuantity(itemId, userId, "increment");
      res.status(HttpStatus.OK).json({ message: "Quantidade do item aumentada com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  decrementItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      await this.cartService.changeItemQuantity(itemId, userId, "decrement");
      res.status(HttpStatus.OK).json({ message: "Quantidade do item diminuida com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  removeItemCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { itemId } = req.params;
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      await this.cartService.removeItemCart(itemId, userId);
      res.status(HttpStatus.OK).json({ message: "Item removido do carrinho com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}

export { CartController };
