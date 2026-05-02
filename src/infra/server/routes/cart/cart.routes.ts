import { cartController } from "@/controllers/cart";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/api/cart",
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Adiciona um item ao carrinho'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["itemId"],
            properties: {
              itemId:   { type: "string", example: "uuid-do-item" },
              quantity: { type: "number", example: 1 },
              status:   { type: "string", enum: ["ATIVO", "INATIVO"], example: "ATIVO" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: 'Item adicionado ao carrinho com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.createCart,
);

cartRouter.get("/api/cart",
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Lista o carrinho do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Carrinho retornado com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.listCart,
);

cartRouter.patch("/api/cart/item/:itemId/increment",
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Incrementa a quantidade de um item no carrinho'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['itemId'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Quantidade incrementada com sucesso' }
    #swagger.responses[404] = { description: 'Item não encontrado no carrinho' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.incremetItemQuantity,
);

cartRouter.patch("/api/cart/item/:itemId/decrement",
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Decrementa a quantidade de um item no carrinho'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['itemId'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Quantidade decrementada com sucesso' }
    #swagger.responses[404] = { description: 'Item não encontrado no carrinho' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.decrementItemQuantity,
);

cartRouter.delete("/api/cart/item/:itemId",
  /*
    #swagger.tags = ['Cart']
    #swagger.summary = 'Remove um item do carrinho'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['itemId'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[204] = { description: 'Item removido do carrinho com sucesso' }
    #swagger.responses[404] = { description: 'Item não encontrado no carrinho' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  cartController.removeItemCart,
);

export { cartRouter };
