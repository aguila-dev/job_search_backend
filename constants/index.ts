require('dotenv').config();
const CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.TEST === 'true',
  isLogging: process.env.LOGGING === 'true',
  version: process.env.VERSION,
  localDatabaseUrl: process.env.LOCAL_PG_DB_URL,
  localDatabaseName: process.env.LOCAL_PG_DB_NAME,
  localDatabaseNameTest: process.env.LOCAL_PG_DB_NAME_TEST,
};

const SECURE = {
  SECRET: process.env.JWT_SECRET,
  SALT: 5,
};

const API = {
  VERSION: 'v1',
  ENDPOINT: 'api',
};

export { CONFIG, SECURE, API };
