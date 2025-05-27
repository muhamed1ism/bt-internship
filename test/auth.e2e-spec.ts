import * as request from 'supertest';
import { RegisterDto } from 'src/auth/dto';
import { app, prisma, setupE2ETest, teardownE2ETest } from './setup';
import { HttpStatus } from '@nestjs/common';
import { auth, FirebaseUser } from './__mocks__/firebase-admin';

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
    const weakPasswordDto = { ...registerDto, password: '123' };

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

  it('should return hasAccount is true if user has account in database', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/google-signin')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ hasAccount: true });
  });

  it("should return hasAccount is false if user doesn't have account in database", async () => {
    await prisma.user.delete({
      where: { email: registerDto.email },
    });

    const response = await request(app.getHttpServer())
      .get('/auth/google-signin')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ hasAccount: false });
  });

  it('should return 401 Unauthorized when signing in with an invalid Google token', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/google-signin')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should register user after Google Sign-In and Firebase user creation', async () => {
    // Creates a user in the Firebase mock to mimic a user created via Google Sign-In,
    // but not yet registered in the backend database
    const firebaseUser: FirebaseUser = {
      displayName: 'John Doe',
      email: registerDto.email,
      password: registerDto.password,
    };
    const user = await auth().createUser(firebaseUser);
    token = user.uid;

    const response = await request(app.getHttpServer())
      .post('/auth/google-register')
      .set('Authorization', 'Bearer ' + token)
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      message: 'Register successful',
      uid: token,
    });
  });

  it('should return 401 Unauthorized when registering with an invalid Google token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/google-register')
      .set('Authorization', 'Bearer invalid-token')
      .send(registerDto);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
