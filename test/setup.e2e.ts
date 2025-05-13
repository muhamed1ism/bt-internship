import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as firebase from 'firebase-admin';
import { RegisterDto } from 'src/auth/dto';

export let app: INestApplication;
export let prisma: PrismaService;

jest.mock('firebase-admin', () => {
  const mockUsers = new Map();

  return {
    apps: [],
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn((token) => {
        const user = mockUsers.get(token);
        if (!user) {
          throw new Error('Invalid token');
        }
        return Promise.resolve({ uid: token });
      }),
      createUser: jest.fn((registerDto: RegisterDto) => {
        const { email, password } = registerDto;
        if (!email || !password) {
          throw new Error('Invalid register DTO');
        }
        const uid = `mock-uid-${mockUsers.size + 1}`;
        mockUsers.set(uid, { uid, email, password });
        return Promise.resolve({ uid, email });
      }),
    })),
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
  };
});

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

  (firebase.auth().verifyIdToken as jest.Mock).mockImplementation((token) => {
    if (token === 'valid-token') {
      return Promise.resolve({ uid: 'test-user-id' });
    }
    throw new Error('Invalid token');
  });

  (firebase.auth().createUser as jest.Mock).mockImplementationOnce(
    (userData) => {
      return Promise.resolve({ uid: 'new-user-id', ...userData });
    },
  );

  prisma = app.get(PrismaService);
  jest.spyOn(console, 'error').mockImplementation(() => {});
  await prisma.cleanDb();
};

export const teardownE2ETest = async () => {
  jest.clearAllMocks();
  if (app) await app.close();
};
