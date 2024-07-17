const Sequelize = require("sequelize");
require("dotenv").config();
import { CONFIG } from "../constants";
const {
  isDevelopment,
  isTest,
  isLogging,
  localDatabaseName,
  localDatabaseUrl,
  localDatabaseNameTest,
} = CONFIG;

console.log({
  isDevelopment,
  isTest,
  isLogging,
  localDatabaseName,
  localDatabaseUrl,
  localDatabaseNameTest,
  dropDb: process.env.DROP_DB,
  alterDb: process.env.ALTER_DB,
  seedDb: process.env.SEED_DB,
  ignoreUpdateOnRestart: process.env.IGNORE_UPDATE_ON_RESTART,
});

interface DBConfig {
  logging?: boolean;
}

const dbConfig: DBConfig = {
  logging: isLogging ? isLogging : false,
};

const prodDatabaseUrl = process.env.PROD_DATABASE_URL;

let db: typeof Sequelize;

/**
 * Set up the database connection as a singleton instance.
 * Will be exported and used throughout the application.
 **/

if (isDevelopment && isTest) {
  db = new Sequelize(`${localDatabaseUrl}/${localDatabaseNameTest}`, {
    ...dbConfig,
    username: process.env.LOCAL_PG_DB_USER,
    password: process.env.LOCAL_PG_DB_PASSWORD,
  });
} else if (isDevelopment) {
  db = new Sequelize(`${localDatabaseUrl}/${localDatabaseName}`, {
    ...dbConfig,
    username: process.env.LOCAL_PG_DB_USER,
    password: process.env.LOCAL_PG_DB_PASSWORD,
  });
} else if (prodDatabaseUrl) {
  db = new Sequelize(prodDatabaseUrl as string, {
    ...dbConfig,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
} else {
  throw new Error(
    `PROD_DATABASE_URL environment variable is not set. ${
      isDevelopment
        ? "Please set it in your .env file. You are in development mode"
        : ""
    }`
  );
}

export default db;
