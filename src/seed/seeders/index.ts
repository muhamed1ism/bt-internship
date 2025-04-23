import { PrismaClient } from '@prisma/client';
import { seedUserData } from './seedUserData';

export const seedAllEntities = async (client: PrismaClient) => {
  await client.$transaction(async (prisma) => {
    await seedUserData(prisma);
  });
};
