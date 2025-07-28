export interface ApiConfig {
  envName: string;
  serverPort: number;
  apiUrl: string;
  dbConfig: {
    type: string;
    host: string;
    port: string;
    username: string;
    password: string;
    database: string;
    logging: boolean;
    cache: boolean;
    ssl: string;
  };
  apiDocumentation: {
    isEnabled: boolean;
    suffix: string;
  };
}

export interface ApiDocumentation {
  isEnabled: boolean;
  suffix: string;
}
