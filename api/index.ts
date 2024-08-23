import { authenticate } from "@/middleware/authMiddleware";
import express, { NextFunction, Request, Response } from "express";
import { publicKey } from "script/genKey";
import adminRoutes from "./adminRoutes";
import applicationsRoute from "./applicationsRoute";
import companiesRoute from "./companiesRoute";
import jobsRoute from "./jobsRoute";
const router = express.Router();

router.use("/jobs", authenticate, jobsRoute);
router.use("/applications", authenticate, applicationsRoute);
router.use("/companies", authenticate, companiesRoute);
router.use("/public-key", (req: Request, res: Response) => {
  res.send(publicKey);
});

// admin
router.use("/admin", adminRoutes);

// error handling
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

export default router;
