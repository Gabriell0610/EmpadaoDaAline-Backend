import { shippingController } from "@/controllers/shipping";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";


export const shippingRouter = Router()

shippingRouter.post("/api/shipping", 
    jwtAtuhenticator.authenticate,
    authorization.anyRole().authorize,
    shippingController.calculateShipping,
)