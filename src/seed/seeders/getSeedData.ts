import base from '../base';
import nonprod from '../nonprod';
import prod from '../prod';

export const isProd = () => ['p', 'u'].includes(process.env['ENV_NAME'] || 'a');

let data;

export const getAllSeedData = (): Record<string, unknown[]> => {
  const env = isProd() ? prod : nonprod;
  const keys = new Set(Object.keys(base));
  Object.keys(env).forEach((key) => keys.add(key));

  data = Array.from(keys).reduce(
    (cfg: Record<string, unknown[]>, key: string) => {
      const baseData = base[key]?.data || [];
      const envData = env[key]?.data || [];
      let data = baseData;
      if (env[key]?.overwrite) {
        data = envData;
      } else {
        data = data.concat(envData);
      }
      cfg[key] = data;

      return cfg;
    },
    {},
  );

  return data;
};

export const getSeedData = (key: string): unknown[] => {
  const data = getAllSeedData();
  return data[key] ?? [];
};
