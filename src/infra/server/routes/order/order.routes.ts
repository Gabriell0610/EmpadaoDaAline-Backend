import { orderController } from "@/controllers/order";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

const orderRouter = Router();

orderRouter.post(
  "/api/order",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.create,
);

orderRouter.get(
  "/api/order",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  orderController.listAllOrders,
);

orderRouter.get(
  "/api/order/me",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN]).authorize,
  orderController.listOrdersMe,
);

orderRouter.get(
  "/api/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.listOrderById,
);

orderRouter.put(
  "/api/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN]).authorize,
  orderController.update,
);

orderRouter.put(
  "/api/order/admin/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  orderController.adminUpdateOrder,
);

orderRouter.patch(
  "/api/order/cancel/:id",
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.cancelOrder,
);

orderRouter.patch(
  "/api/order/confirm/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.CLIENT]).authorize,
  orderController.clientConfirmOrder,
);

orderRouter.patch(
  "/api/changeStatus/order/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  orderController.changeStatusOrder,
);

export { orderRouter };
