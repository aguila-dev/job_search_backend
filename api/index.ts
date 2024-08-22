import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import jobsRoute from "./jobsRoute";
import applicationsRoute from "./applicationsRoute";
import adminRoutes from "./adminRoutes";
import companiesRoute from "./companiesRoute";
import { publicKey } from "script/genKey";

router.use("/jobs", jobsRoute);
router.use("/applications", applicationsRoute);
router.use("/companies", companiesRoute);
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
