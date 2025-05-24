import * as request from 'supertest';
import { app, setupE2ETest, teardownE2ETest, prisma } from './setup';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('User (e2e)', () => {
  beforeAll(async () => {
    await setupE2ETest();
  }, 10000);

  afterAll(async () => {
    await teardownE2ETest();
  });

  let token: string;

  const registerDto = {
    email: 'test@example.com',
    password: '123ABcd.',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  };

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('uid');
    token = response.body.uid;
  });

  it('should return user data for a valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/current-user')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      dateOfBirth: '2000-01-02T00:00:00.000Z',
    });
  });

  it('should not return user data for an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/current-user')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: 'Invalid token',
    });
  });

  it('should not return user data without a token', async () => {
    const response = await request(app.getHttpServer()).get(
      '/user/current-user',
    );

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: 'Missing or invalid Authorization header',
    });
  });

  it("should forbid 'user' role from accessing '/user/all'", async () => {
    await request(app.getHttpServer())
      .get('/user/all')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.FORBIDDEN);
  });

  it("should allow access to '/user/all' for 'admin' role", async () => {
    // updates test user role to 'admin'
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });
    if (!adminRole) throw new NotFoundException('Admin role not found.');
    await prisma.user.update({
      where: { email: registerDto.email },
      data: { roleId: adminRole.id },
    });

    await request(app.getHttpServer())
      .get('/user/all')
      .set('Authorization', 'Bearer ' + token)
      .expect(HttpStatus.OK);
  });
});
