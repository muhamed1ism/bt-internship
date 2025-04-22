import { SeedData } from '../types';
import { userSeedData } from './userSeedData';

export default {
  User: {
    data: userSeedData,
    overwrite: true,
  },
} as SeedData;
