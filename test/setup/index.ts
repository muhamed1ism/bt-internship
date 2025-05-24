import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

export let app: INestApplication;
export let prisma: PrismaService;

jest.mock('firebase-admin');

export const setupE2ETest = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(4001);

  prisma = app.get(PrismaService);

  // Suppress all console.error output during tests to keep test logs clean
  jest.spyOn(console, 'error').mockImplementation(() => {});

  await prisma.cleanDb();
};

export const teardownE2ETest = async () => {
  jest.clearAllMocks();
  if (app) await app.close();
};
