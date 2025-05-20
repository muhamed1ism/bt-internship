import * as request from 'supertest';
import { RegisterDto } from 'src/auth/dto';
import { app, setupE2ETest, teardownE2ETest } from './setup.e2e';
import { HttpStatus } from '@nestjs/common';

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await setupE2ETest();
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  });

  const registerDto: RegisterDto = {
    email: 'test@example.com',
    password: '123ABcd.',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  };

  let token: string;

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('uid');
    token = response.body.uid;
  });

  it('should not register a user with an existing email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(response.body).toMatchObject({
      message: 'Prisma: Credentials taken',
    });
  });

  it('should not register a user with invalid data', async () => {
    const invalidRegisterDto = { email: 'invalid-email' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidRegisterDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message');
  });

  it('should not register a user with a weak password', async () => {
    const weakPasswordDto = { ...registerDto, password: '123' }; // Weak password

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(weakPasswordDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message');
  });

  it('should not register a user with an invalid phone number', async () => {
    const invalidPhoneDto = { ...registerDto, phoneNumber: 'invalid-phone' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidPhoneDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message');
  });
});
