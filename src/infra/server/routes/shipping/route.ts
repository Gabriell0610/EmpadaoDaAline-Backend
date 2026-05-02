import { shippingController } from "@/controllers/shipping";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";

export const shippingRouter = Router();

shippingRouter.post("/api/shipping", (req, res, next) => {
  /*
    #swagger.tags = ['Shipping']
    #swagger.summary = 'Calcula o frete para o endereço do usuário'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "string", example: "uuid-do-endereco", description: "ID do endereço do usuário" } } } } } }
    #swagger.responses[200] = { description: 'Frete calculado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[404] = { description: 'Endereço não encontrado' }
  */
  jwtAtuhenticator.authenticate(req, res, () =>
    authorization.anyRole().authorize(req, res, () => shippingController.calculateShipping(req, res, next)),
  );
});
