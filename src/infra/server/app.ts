import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRouter,
  cartRouter,
  itensRouter,
  userRouter,
  orderRouter,
  paymentMethodRouter,
  dashboardRouter,
} from "./routes";
import { errorHandlerMiddleware } from "../../middlewares/error";
import { shippingRouter } from "./routes/shipping/route";
import { initLoginRateLimiter } from "@/middlewares/loginRateLimit/loginRateLimit";
import { connectRedis } from "@/libs/redis/redis";
import { bindRequestContext, httpLogger } from "@/libs/logger";

export async function createApp() {
  await connectRedis();
  initLoginRateLimiter();

  const app = express();
  app.set("trust proxy", 1);
  app.use(httpLogger);
  app.use(bindRequestContext);
  app.use((req, res, next) => {
    if (req.requestId) {
      res.setHeader("x-request-id", req.requestId);
    }

    next();
  });

  app.use(
    cors({
      origin: process.env.BASE_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Accept", "Authorization", "Content-Type"],
      credentials: true,
    }),
  );

  // Usando o middleware do CORS
  app.use(express.json());
  app.use(cookieParser());

  app.use(userRouter);
  app.use(authRouter);
  app.use(itensRouter);
  app.use(cartRouter);
  app.use(orderRouter);
  app.use(shippingRouter);
  app.use(paymentMethodRouter);
  app.use(dashboardRouter);
  app.use(errorHandlerMiddleware.handle);

  return app;
}
