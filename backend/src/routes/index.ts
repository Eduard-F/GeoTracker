import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import { Express } from "express";

export function initRoutes(app: Express) {
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/healthcheck", (req, res) => res.send("OK"));
}
