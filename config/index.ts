import defaultConfig from './default';
import a from './a';
import d from './d';
import t from './t';
import p from './p';
import { ApiConfig } from './types/api-config.type';

export const apiConfigFiles: Record<string, Partial<ApiConfig>> = {
  defaultConfig,
  a,
  d,
  t,
  p,
};

const validEnvNames = ['a', 'd', 't', 'p'];

const envName = process.env.APP_ENV;

if (envName && !validEnvNames.includes(envName)) {
  throw new Error('Valid env name is not provided!');
}

export const apiConfig = {
  ...apiConfigFiles.default,
  ...apiConfigFiles[envName || 'a'],
} as ApiConfig;
