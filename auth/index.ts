import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./authRoutes";
const router = express.Router();

router.use("/", authRoutes);

// error handling
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("error", err);
  console.error("error stack", err.stack);
  const status = (err as any).status || 500;
  res.status(status).send(err.message || "Internal Server Error");
});

export default router;
