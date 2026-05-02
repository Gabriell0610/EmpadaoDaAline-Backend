import { userController } from "@/controllers/user";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/api/users",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Lista todos os usuários (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Lista de usuários retornada com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  userController.list,
);

userRouter.get("/api/users/me",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Retorna os dados do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Dados do usuário logado' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.listLoggedUser,
);

userRouter.put("/api/users",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Atualiza os dados do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name:      { type: "string", example: "Novo Nome" },
              email:     { type: "string", example: "novo@email.com" },
              cellphone: { type: "string", example: "11999999999" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Usuário atualizado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.updateUser,
);

userRouter.post("/api/users/address",
  /*
    #swagger.tags = ['Users - Address']
    #swagger.summary = 'Adiciona um endereço ao usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["street", "number", "city", "state", "zipCode"],
            properties: {
              street:       { type: "string", example: "Rua das Flores" },
              number:       { type: "string", example: "123" },
              complement:   { type: "string", example: "Apto 45" },
              neighborhood: { type: "string", example: "Centro" },
              city:         { type: "string", example: "São Paulo" },
              state:        { type: "string", example: "SP" },
              zipCode:      { type: "string", example: "01001000" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: 'Endereço adicionado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.addAddress,
);

userRouter.get("/api/users/address/me",
  /*
    #swagger.tags = ['Users - Address']
    #swagger.summary = 'Lista os endereços do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Lista de endereços retornada com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.listAddressByUserId,
);

userRouter.put("/api/users/address/:idAddress",
  /*
    #swagger.tags = ['Users - Address']
    #swagger.summary = 'Atualiza um endereço do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['idAddress'] = {
      in: 'path',
      description: 'ID do endereco',
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
              street:       { type: "string", example: "Rua Nova" },
              number:       { type: "string", example: "456" },
              complement:   { type: "string", example: "Casa" },
              neighborhood: { type: "string", example: "Vila Madalena" },
              city:         { type: "string", example: "São Paulo" },
              state:        { type: "string", example: "SP" },
              zipCode:      { type: "string", example: "05412000" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Endereço atualizado com sucesso' }
    #swagger.responses[404] = { description: 'Endereço não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.updateUserAddress,
);

userRouter.delete("/api/users/:idAddress/address",
  /*
    #swagger.tags = ['Users - Address']
    #swagger.summary = 'Remove um endereço do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['idAddress'] = {
      in: 'path',
      description: 'ID do endereco',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[204] = { description: 'Endereço removido com sucesso' }
    #swagger.responses[404] = { description: 'Endereço não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  userController.removeAddress,
);

export { userRouter };
