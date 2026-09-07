jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('mock_secret'),
  generateURI: jest.fn().mockReturnValue('mock_uri'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

jest.mock('@otplib/plugin-base32-scure', () => ({}), { virtual: true });
jest.mock('@scure/base', () => ({}), { virtual: true });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import cookieParser = require('cookie-parser');
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';


describe('Auth & Users (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testUser = {
    email: 'e2e_user@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
  };

  let accessTokenCookie: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and set HTTP-only cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body).not.toHaveProperty('password');

      const cookies = response.get('Set-Cookie');
      expect(cookies).toBeDefined();
      expect(cookies?.some((c) => c.startsWith('accessToken='))).toBe(true);
      expect(cookies?.some((c) => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should fail registration with duplicate email (409 Conflict)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should authenticate user and return cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const cookies = response.get('Set-Cookie');
      expect(cookies).toBeDefined();

      accessTokenCookie = cookies?.find((c) => c.startsWith('accessToken='))!;
      refreshTokenCookie = cookies?.find((c) => c.startsWith('refreshToken='))!;
    });

    it('should fail login with wrong password (401 Unauthorized)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user profile when accessToken cookie is present', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', [accessTokenCookie])
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.headers['cache-control']).toBe(
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
    });

    it('should reject request without accessToken (401 Unauthorized)', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens using refreshToken cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [refreshTokenCookie])
        .expect(200);

      expect(response.body).toEqual({ success: true });

      const newCookies = response.get('Set-Cookie');
      expect(newCookies).toBeDefined();

      accessTokenCookie = newCookies?.find((c) => c.startsWith('accessToken='))!;
    });
  });

  describe('DELETE /users/me', () => {
    it('should delete the authenticated user account', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Cookie', [accessTokenCookie])
        .expect(200);

      const deletedUser = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });
      expect(deletedUser).toBeNull();
    });
  });
});