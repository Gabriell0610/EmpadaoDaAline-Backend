import { orderController } from "@/controllers/order";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

export const orderRouter = Router();

orderRouter.post("/api/order",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Cria um novo pedido'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["idAddress", "idPaymentMethod", "schedulingDate", "startTime", "endTime", "shipping"], properties: { idAddress: { type: "string", example: "uuid-do-endereco" }, idPaymentMethod: { type: "string", example: "uuid-do-metodo-pagamento" }, status: { type: "string", enum: ["PENDENTE", "CONFIRMADO", "CANCELADO"], example: "PENDENTE" }, schedulingDate: { type: "string", example: "2025-12-31" }, startTime: { type: "string", example: "09:00" }, endTime: { type: "string", example: "10:00" }, observation: { type: "string", example: "Sem cebola" }, shipping: { type: "string", example: "15.90" }, nameClient: { type: "string", example: "João Silva" }, cellphoneClient: { type: "string", example: "11999999999" } } } } } }
    #swagger.responses[201] = { description: 'Pedido criado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.create,
);

orderRouter.get("/api/order",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Lista todos os pedidos (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['status'] = {
      in: 'query',
      description: 'Filtrar por status do pedido',
      required: false,
      schema: { type: 'string', enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONFIRMADO_CLIENTE'] }
    }
    #swagger.responses[200] = { description: 'Pedidos listados com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize,
  orderController.listAllOrders,
);

orderRouter.get("/api/order/me",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Lista os pedidos do usuário logado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Pedidos do usuário listados com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  orderController.listOrdersMe,
);

orderRouter.get("/api/order/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Busca um pedido pelo ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Pedido encontrado com sucesso' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.listOrderById,
);

orderRouter.put("/api/order/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Atualiza um pedido (cliente ou admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", properties: { idAddress: { type: "string", example: "uuid-do-endereco" }, idPaymentMethod: { type: "string", example: "uuid-do-metodo-pagamento" }, schedulingDate: { type: "string", example: "2025-12-31" }, startTime: { type: "string", example: "09:00" }, endTime: { type: "string", example: "10:00" }, observation: { type: "string", example: "Sem cebola" }, shipping: { type: "string", example: "15.90" } } } } } }
    #swagger.responses[200] = { description: 'Pedido atualizado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT, AccessProfile.ADMIN])
      .authorize,
  orderController.update,
);

orderRouter.put("/api/order/admin/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Atualiza um pedido como admin'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", properties: { idAddress: { type: "string", example: "uuid-do-endereco" }, idPaymentMethod: { type: "string", example: "uuid-do-metodo-pagamento" }, schedulingDate: { type: "string", example: "2025-12-31" }, startTime: { type: "string", example: "09:00" }, endTime: { type: "string", example: "10:00" }, observation: { type: "string", example: "Sem cebola" }, shipping: { type: "string", example: "15.90" } } } } } }
    #swagger.responses[200] = { description: 'Pedido atualizado com sucesso' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize,
  orderController.adminUpdateOrder,
);

orderRouter.patch("/api/order/cancel/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Cancela um pedido'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Pedido cancelado com sucesso' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization.anyRole().authorize,
  orderController.cancelOrder,
);

orderRouter.patch("/api/order/confirm/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Confirma um pedido (cliente)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.responses[200] = { description: 'Pedido confirmado com sucesso' }
    #swagger.responses[403] = { description: 'Sem permissão' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.CLIENT])
      .authorize,
  orderController.clientConfirmOrder,
);

orderRouter.patch("/api/changeStatus/order/:id",
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = 'Altera o status de um pedido (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do pedido',
      required: true,
      type: 'string',
      example: '2c4b0263-250b-4b59-9475-c6858491c0eee'
    }
    #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["status"], properties: { status: { type: "string", enum: ["PENDENTE", "CONFIRMADO", "CANCELADO", "CONFIRMADO_CLIENTE"], example: "CONFIRMADO" } } } } } }
    #swagger.responses[200] = { description: 'Status do pedido alterado com sucesso' }
    #swagger.responses[400] = { description: 'Status inválido' }
    #swagger.responses[404] = { description: 'Pedido não encontrado' }
  */
  jwtAtuhenticator.authenticate,
  authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize,
  orderController.changeStatusOrder,
);
