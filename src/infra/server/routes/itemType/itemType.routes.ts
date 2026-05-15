import { itemTypeController } from "@/controllers/itemType";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

export const itemTypeRouter = Router();

itemTypeRouter.get(
  "/api/item-types",
  /*
    #swagger.tags = ['Item Types']
    #swagger.summary = 'Lista todos os tipos de item cadastrados'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Tipos de item listados com sucesso',
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", example: "2c4b0263-250b-4b59-9475-c6858491c0eee" },
                nome: { type: "string", example: "EMPADAO" }
              }
            }
          }
        }
      }
    }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  itemTypeController.listAll,
);

itemTypeRouter.post(
  "/api/item-types",
  /*
    #swagger.tags = ['Item Types']
    #swagger.summary = 'Cadastra um novo tipo de item (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["nome"],
            properties: {
              nome: { type: "string", example: "TORTA" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Tipo de item criado com sucesso',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", example: "2c4b0263-250b-4b59-9475-c6858491c0eee" },
              nome: { type: "string", example: "TORTA" }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
    #swagger.responses[409] = { description: 'Tipo de item já cadastrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itemTypeController.create,
);
