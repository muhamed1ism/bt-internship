import * as dotenv from 'dotenv';

dotenv.config();

function getServerPort(): number {
  return process.env.PORT ? parseInt(process.env.PORT) : 4000;
}

export default {
  envName: process.env.ENV_NAME || 'a',
  serverPort: getServerPort(),
  apiUrl: process.env.API_URL || `http://localhost:${getServerPort()}`,
  appUrl: process.env.APP_URL || 'http://localhost:4200',
  dbConfig: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '5432',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_DB || 'app_local',
    logging: false,
    cache: false,
    ssl: '',
  },
  apiDocumentation: {
    isEnabled: true,
    suffix: '0001',
  },
};
