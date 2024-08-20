require("dotenv").config();
import express, { Request, Response, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import { API } from "./constants";
import { corsAllowList } from "config/allowList";

const app: Express = express();
const router = express.Router();

import apiRoutes from "./api";
import authRoutes from "./auth";
import path from "path";
import { errorHandling } from "middleware/errorHandling";

/**
 * Cors Configuration
 */
const allowList = corsAllowList();
app.use(cors({ origin: allowList, credentials: true }));

/**
 * Middleware
 */
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // Set to true if using https
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

/**
 * Static Files
 */
app.use("/images", express.static(path.join(__dirname, "public", "images")));

app.use(router);

/**
 * API Routing Health Check
 * */
router.get("/v1/api/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

/**
 * API Routing
 * */
app.use(`/${API.VERSION}/${API.API_ENDPOINT}`, apiRoutes);

/**
 * Auth Routing Health Check
 * */
router.get("/v1/auth/health", (req: Request, res: Response) => {
  res.sendStatus(200);
});

/**
 * Auth Routing
 * */
app.use(`/${API.VERSION}/${API.AUTH_ENDPOINT}`, authRoutes);

/* Error handling */
app.use(errorHandling);

export default app;
