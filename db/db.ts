const Sequelize = require('sequelize');
require('dotenv').config();
import { CONFIG } from '../constants';
const {
  isDevelopment,
  isTest,
  isLogging,
  localDatabaseName,
  localDatabaseUrl,
  localDatabaseNameTest,
} = CONFIG;

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
  db = new Sequelize(`${localDatabaseUrl}/${localDatabaseNameTest}`, dbConfig);
} else if (isDevelopment) {
  db = new Sequelize(`${localDatabaseUrl}/${localDatabaseName}`, dbConfig);
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
        ? 'Please set it in your .env file. You are in development mode'
        : ''
    }`
  );
}

export default db;
