import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter, cartRouter, itensRouter, userRouter, orderRouter, manualOrderRouter } from "./routes";
import { errorHandlerMiddleware } from "../../middlewares/error";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true, // <- ESSENCIAL para cookies
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
app.use(manualOrderRouter);
app.use(errorHandlerMiddleware.handle);

export default app;
