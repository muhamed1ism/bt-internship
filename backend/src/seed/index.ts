import { PrismaClient } from '@prisma/client';
import { seedAllEntities } from './seeders';

const client = new PrismaClient();

export const runSeed = async () => {
  console.info(`Seed Starting #${process.pid}`);
  await seedAllEntities(client);
  console.info(`Seed Finished #${process.pid}`);
};
