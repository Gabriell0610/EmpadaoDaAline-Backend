import { itensController } from "@/controllers/itens";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

const itensRouter = Router();

itensRouter.post("/api/itens",
  /*
    #swagger.tags = ['Itens']
    #swagger.summary = 'Cria um novo item (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "price", "description", "image", "size", "type"],
            properties: {
              name:        { type: "string", example: "Pizza Margherita" },
              price:       { type: "string", example: "49.90" },
              description: { type: "string", example: "Pizza com molho de tomate e mussarela" },
              image:       { type: "string", example: "https://url-da-imagem.com/pizza.jpg" },
              available:   { type: "string", enum: ["ATIVO", "INATIVO"], example: "ATIVO" },
              size:        { type: "string", enum: ["P", "M", "G", "GG"], example: "M" },
              unitPrice:   { type: "number", example: 49.90 },
              unity:       { type: "number", example: 1 },
              type:        { type: "string", enum: ["FOOD", "DRINK", "DESSERT"], example: "FOOD" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: 'Item criado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.create,
);

itensRouter.get("/api/itens",
  /*
    #swagger.tags = ['Itens']
    #swagger.summary = 'Lista todos os itens'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Lista de itens retornada com sucesso' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  itensController.list,
);

itensRouter.get("/api/itens/:id",
  /*
    #swagger.tags = ['Itens']
    #swagger.summary = 'Busca um item pelo ID'
    #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Item encontrado' }
    #swagger.responses[404] = { description: 'Item não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  itensController.listItemById,
);

itensRouter.put("/api/itens/:id",
  /*
    #swagger.tags = ['Itens']
    #swagger.summary = 'Atualiza um item (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name:        { type: "string", example: "Pizza Margherita" },
              price:       { type: "string", example: "49.90" },
              description: { type: "string", example: "Descrição atualizada" },
              image:       { type: "string", example: "https://url-da-imagem.com/pizza.jpg" },
              available:   { type: "string", enum: ["ATIVO", "INATIVO"], example: "ATIVO" },
              size:        { type: "string", enum: ["P", "M", "G", "GG"], example: "G" },
              unitPrice:   { type: "number", example: 55.90 },
              unity:       { type: "number", example: 1 },
              type:        { type: "string", enum: ["FOOD", "DRINK", "DESSERT"], example: "FOOD" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Item atualizado com sucesso' }
    #swagger.responses[404] = { description: 'Item não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.update,
);

itensRouter.patch("/api/itens/:id",
  /*
    #swagger.tags = ['Itens']
    #swagger.summary = 'Inativa Item'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do item',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Item inativado com sucesso' }
    #swagger.responses[404] = { description: 'Item não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize,
  itensController.inactiveItem,
);

export { itensRouter };
