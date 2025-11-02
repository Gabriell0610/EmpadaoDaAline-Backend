import { shippingController } from "@/controllers/shipping";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { AccessProfile } from "@/shared/constants";
import { Router } from "express";


export const shippingRouter = Router()

shippingRouter.post("/api/shipping", 
    jwtAtuhenticator.authenticate,
    authorization.ofRoles([AccessProfile.CLIENT]).authorize,
    shippingController.calculateShipping,
)