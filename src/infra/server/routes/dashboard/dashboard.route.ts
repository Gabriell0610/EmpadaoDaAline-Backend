import { dashboardController } from "@/controllers/dashboard";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";

export const dashboardRouter = Router();

dashboardRouter.get("/api/dashboard/summary", (req, res, next) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Retorna o resumo do dashboard (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['startDate'] = {
      in: 'query',
      description: 'Data de início do filtro',
      required: false,
      schema: { type: 'string', example: '2025-01-01', description: 'Formato YYYY-MM-DD' }
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      description: 'Data de fim do filtro',
      required: false,
      schema: { type: 'string', example: '2025-12-31', description: 'Formato YYYY-MM-DD' }
    }
    #swagger.responses[200] = { description: 'Resumo do dashboard retornado com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate(req, res, () =>
    authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize(req, res, () => dashboardController.getDashboardSummary(req, res, next)),
  );
});

dashboardRouter.get("/api/dashboard/revenue", (req, res, next) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Retorna o faturamento do dashboard (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['startDate'] = {
      in: 'query',
      description: 'Data de início do filtro',
      required: false,
      schema: { type: 'string', example: '2025-01-01', description: 'Formato YYYY-MM-DD' }
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      description: 'Data de fim do filtro',
      required: false,
      schema: { type: 'string', example: '2025-12-31', description: 'Formato YYYY-MM-DD' }
    }
    #swagger.responses[200] = { description: 'Faturamento retornado com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate(req, res, () =>
    authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize(req, res, () => dashboardController.getDashboardRevenue(req, res, next)),
  );
});

dashboardRouter.get("/api/dashboard/quick-stats", (req, res, next) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Retorna estatísticas rápidas do dashboard (admin)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'Estatísticas rápidas retornadas com sucesso' }
    #swagger.responses[401] = { description: 'Não autorizado' }
    #swagger.responses[403] = { description: 'Sem permissão' }
  */
  jwtAtuhenticator.authenticate(req, res, () =>
    authorization
      .ofRoles([AccessProfile.ADMIN])
      .authorize(req, res, () => dashboardController.getDashboardQuickSats(req, res, next)),
  );
});
