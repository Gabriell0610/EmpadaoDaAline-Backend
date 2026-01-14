import { dashboardController } from "@/controllers/dashboard";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";


export const dashboardRouter = Router();

dashboardRouter.get(
    '/api/dashboard/summary', 
    jwtAtuhenticator.authenticate,
    authorization.ofRoles([AccessProfile.ADMIN]).authorize,
    dashboardController.getDashboardSummary
)

dashboardRouter.get(
    '/api/dashboard/revenue', 
    jwtAtuhenticator.authenticate,
    authorization.ofRoles([AccessProfile.ADMIN]).authorize,
    dashboardController.getDashboardRevenue
)




