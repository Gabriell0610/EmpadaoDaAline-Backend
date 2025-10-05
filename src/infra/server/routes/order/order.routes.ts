import { orderController } from "@/controllers/order";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

const orderRouter = Router();

orderRouter.post(
  "/api/order",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT]).authorize,
  orderController.create,
);

orderRouter.get(
  "/api/order",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  orderController.listAllOrders,
);

orderRouter.get(
  "/api/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT]).authorize,
  orderController.listOrderByClientId,
);

orderRouter.get(
  "/api/order/me/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT]).authorize,
  orderController.listOrdersMe,
);


orderRouter.put(
  "/api/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT]).authorize,
  orderController.update,
);

orderRouter.patch(
  "/api/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.cancelOrder,
);


orderRouter.patch(
  "/api/changeStatus/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  orderController.changeStatusOrder,
);

export { orderRouter };
