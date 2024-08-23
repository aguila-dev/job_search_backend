import dotenv from "dotenv";
import path from "path";

// Determine the environment file name based on NODE_ENV or default to '.env.local'
let envFile: string;

switch (process.env.NODE_ENV) {
  case "development":
    envFile = ".env.local";
    break;
  case "staging":
    envFile = ".env.staging";
    break;
  case "production":
    envFile = ".env.production";
    break;
  default:
    envFile = ".env.local";
    break;
}

// Construct the path to the environment file
const envPath = path.resolve(process.cwd(), envFile);

// Load the environment variables from the specified file
dotenv.config({ path: envPath });

const CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.TEST === "true",
  isLogging: process.env.LOGGING === "true",
  version: process.env.VERSION,
  localDatabaseUrl: process.env.LOCAL_PG_DB_URL,
  localDatabaseName: process.env.LOCAL_PG_DB_NAME,
  localDatabaseNameTest: process.env.LOCAL_PG_DB_NAME_TEST,
};

const SECURE = {
  SECRET: process.env.JWT_SECRET,
  SALT: 5,
};

const AUTH_COOKIES = {
  accessTokenKey: "_jaAT",
  refreshTokenKey: "_jaRT",
};

const API = {
  VERSION: "v1",
  API_ENDPOINT: "api",
  AUTH_ENDPOINT: "auth",
};

export { API, AUTH_COOKIES, CONFIG, SECURE };
