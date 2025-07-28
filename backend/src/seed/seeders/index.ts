import { PrismaClient } from '@prisma/client';
import { seedUserData } from './seedUserData';
import { seedPermissionData } from './seedPermissionData';
import { seedRoleData } from './seedRoleData';

export const seedAllEntities = async (client: PrismaClient) => {
  await client.$transaction(async (prisma) => {
    await seedRoleData(prisma);
    await seedPermissionData(prisma);
    await seedUserData(prisma);
  });
};
