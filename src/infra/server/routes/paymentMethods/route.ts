import { paymentMethodController } from "@/controllers/paymentMethod";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";



export const paymentMethodRouter = Router()

paymentMethodRouter.get(
    "/api/paymentMethods",
    jwtAtuhenticator.authenticate,
    authorization.anyRole().authorize, 
    paymentMethodController.listAllPaymentMethod
)