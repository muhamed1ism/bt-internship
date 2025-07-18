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

  it("should return only current user if 'user' role", async () => {
    const response = await request(app.getHttpServer())
      .get('/user/all')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject([
      {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phoneNumber: registerDto.phoneNumber,
        dateOfBirth: '2000-01-02T00:00:00.000Z',
      },
    ]);
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

  it('should update user profile successfully', async () => {
    const updateProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+38761234568',
      dateOfBirth: new Date('1995-05-15T00:00:00.000Z'),
    };

    const response = await request(app.getHttpServer())
      .put('/user/profile')
      .set('Authorization', 'Bearer ' + token)
      .send(updateProfileDto);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      email: updateProfileDto.email,
      phoneNumber: updateProfileDto.phoneNumber,
      dateOfBirth: '1995-05-15T00:00:00.000Z',
    });
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('role');
  });

  it('should reject profile update with duplicate email', async () => {
    // Create another user first
    const anotherUser = {
      email: 'another@example.com',
      password: '123ABcd.',
      firstName: 'Another',
      lastName: 'User',
      phoneNumber: '+38761234569',
      dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(anotherUser);

    // Try to update profile with existing email
    const updateProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'another@example.com', // This email already exists
      phoneNumber: '+38761234568',
      dateOfBirth: new Date('1995-05-15T00:00:00.000Z'),
    };

    const response = await request(app.getHttpServer())
      .put('/user/profile')
      .set('Authorization', 'Bearer ' + token)
      .send(updateProfileDto);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should reject profile update without authentication', async () => {
    const updateProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+38761234568',
      dateOfBirth: new Date('1995-05-15T00:00:00.000Z'),
    };

    const response = await request(app.getHttpServer())
      .put('/user/profile')
      .send(updateProfileDto);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
