import { authUserController } from "@/controllers/auth";
import { loginRateLimiterMiddleware } from "@/middlewares/loginRateLimit/loginRateLimit";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/api/auth/register", authUserController.register);
authRouter.post("/api/auth/login", loginRateLimiterMiddleware, authUserController.login);
authRouter.post("/api/auth/refresh", authUserController.refreshToken);
authRouter.post("/api/auth/logout", authUserController.logout);

authRouter.post("/api/auth/forgot-password", authUserController.forgetPassword);
authRouter.post("/api/auth/validate-token", authUserController.validateToken);
authRouter.post("/api/auth/reset-password", authUserController.resetPassword);

export { authRouter };
