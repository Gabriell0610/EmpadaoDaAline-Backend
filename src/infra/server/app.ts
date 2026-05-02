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
import { globalRateLimiter, initRateLimiters } from "@/middlewares/rateLimiting/rateLimitingMiddleware";
import { connectRedis } from "@/libs/redis/redis";
import { bindRequestContext, httpLogger } from "@/libs/logger";
import helmet from "helmet";
import { healthRouter } from "./routes/health";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../swagger-output.json";

export async function createApp() {
  await connectRedis();
  initRateLimiters();

  const app = express();
  app.set("trust proxy", 1);
  app.use(httpLogger);
  app.use(helmet());
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

  app.use(express.json({ limit: "15kb" }));
  app.use(cookieParser());
  app.use(healthRouter);
  app.use(globalRateLimiter);

  if (process.env.NODE_ENV !== "production") {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        swaggerOptions: { persistAuthorization: true },
      }),
    );
  }

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
