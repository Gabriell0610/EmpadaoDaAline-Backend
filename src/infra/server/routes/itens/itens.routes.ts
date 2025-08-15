import { AccessProfile } from "@/shared/constants/accessProfile";
import { itensController } from "@/controllers/itens";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";

const itensRouter = Router();

itensRouter.post(
  "/api/itens",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.create,
);

itensRouter.get(
  "/api/itens",
  // jwtAtuhenticator.authenticate,
  // authorization.anyRole().authorize,
  itensController.list,
);

itensRouter.get(
  "/api/itens/active",
  //jwtAtuhenticator.authenticate,
  //authorization.anyRole().authorize,
  itensController.listActiveItensDescription,
);

itensRouter.get("/api/itens/:id", itensController.listItemById);

itensRouter.put(
  "/api/itens/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.update,
);

itensRouter.patch(
  "/api/itens/:id",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.inactiveItem,
);

export { itensRouter };
