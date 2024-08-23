const router = require("express").Router();
import { authenticate } from "@/middleware/authMiddleware";
import * as companiesController from "../controllers/companiesController";

router.get("/", authenticate, companiesController.getAllCompanies);

export default router;
