import { paymentMethodController } from "@/controllers/paymentMethod";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";

export const paymentMethodRouter = Router();

paymentMethodRouter.get("/api/paymentMethods", (req, res, next) => {
  /*
    #swagger.tags = ['Payment Methods']
    #swagger.summary = 'Lista todos os métodos de pagamento disponíveis'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Métodos de pagamento listados com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate(req, res, () =>
    authorization.anyRole().authorize(req, res, () => paymentMethodController.listAllPaymentMethod(req, res, next)),
  );
});
