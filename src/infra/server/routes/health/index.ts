import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "api ok" });
});
