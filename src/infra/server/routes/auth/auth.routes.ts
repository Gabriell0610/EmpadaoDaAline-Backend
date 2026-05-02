import { authUserController } from "@/controllers/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/api/auth/register",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Cadastra um novo usuário'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email", "password", "cellphone"],
            properties: {
              name:      { type: "string", example: "João Silva" },
              email:     { type: "string", example: "joao@email.com" },
              password:  { type: "string", example: "Senha@123" },
              cellphone: { type: "string", example: "11999999999" },
              role:      { type: "string", enum: ["ADMIN", "CLIENT"], example: "CLIENT" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: 'Usuário criado com sucesso' }
    #swagger.responses[400] = { description: 'Dados inválidos' }
    #swagger.responses[409] = { description: 'E-mail já cadastrado' }
  */
  authUserController.register,
);

authRouter.post("/api/auth/login",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Realiza login e retorna o accessToken'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email:    { type: "string", example: "joao@email.com" },
              password: { type: "string", example: "Senha@123" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Login realizado com sucesso' }
    #swagger.responses[401] = { description: 'Credenciais inválidas' }
  */
  authUserController.login,
);

authRouter.post("/api/auth/refresh",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Renova o accessToken usando o refreshToken do cookie'
    #swagger.security = [{ "cookieAuth": [] }]
    #swagger.responses[200] = { description: 'Token renovado com sucesso' }
    #swagger.responses[401] = { description: 'Refresh token inválido ou expirado' }
  */
  authUserController.refreshToken,
);

authRouter.post("/api/auth/logout",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Realiza logout e invalida o refreshToken'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204] = { description: 'Logout realizado com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
  */
  authUserController.logout,
);

authRouter.post("/api/auth/forgot-password",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Envia e-mail de recuperação de senha'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email"],
            properties: {
              email: { type: "string", example: "joao@email.com" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'E-mail enviado com sucesso' }
    #swagger.responses[404] = { description: 'Usuário não encontrado' }
  */
  authUserController.forgetPassword,
);

authRouter.post("/api/auth/validate-token",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Valida o token de recuperação de senha'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "token"],
            properties: {
              email: { type: "string", example: "joao@email.com" },
              token: { type: "string", example: "123456" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Token válido' }
    #swagger.responses[400] = { description: 'Token inválido ou expirado' }
  */
  authUserController.validateToken,
);

authRouter.post("/api/auth/reset-password",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Redefine a senha do usuário'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "token", "newPassword"],
            properties: {
              email:       { type: "string", example: "joao@email.com" },
              token:       { type: "string", example: "123456" },
              newPassword: { type: "string", example: "NovaSenha@123" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Senha redefinida com sucesso' }
    #swagger.responses[400] = { description: 'Token inválido ou expirado' }
  */
  authUserController.resetPassword,
);
