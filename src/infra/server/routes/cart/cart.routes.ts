import { cartController } from "@/controllers/cart";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";import { Router } from "express";

const cartRouter = Router();

cartRouter.post(
  "/api/cart",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.createCart,
);

cartRouter.get(
  "/api/cart",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.listCart,
);

cartRouter.patch(
  "/api/cart/item/:itemId/increment",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.incremetItemQuantity,
);
cartRouter.patch(
  "/api/cart/item/:itemId/decrement",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.decrementItemQuantity,
);

cartRouter.delete(
  "/api/cart/item/:itemId",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.removeItemCart,
);

export { cartRouter };
