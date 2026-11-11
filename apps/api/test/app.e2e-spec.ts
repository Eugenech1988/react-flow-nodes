jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('mock_secret'),
  generateURI: jest.fn().mockReturnValue('mock_uri'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

jest.mock('@otplib/plugin-base32-scure', () => ({}), { virtual: true });
jest.mock('@scure/base', () => ({}), { virtual: true });

jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn(() => jest.fn()),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import cookieParser = require('cookie-parser');
import * as fs from 'node:fs';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

import { UsersService } from '@/users/users.service';
import { AuthService } from '@/auth/auth.service';
import { AiService } from '@/ai/ai.service';
import { BillingService } from '@/billing/billing.service';
import { PipelinesService } from '@/pipelines/pipelines.service';
import { ProfileService } from '@/profile/profile.service';
import { DatabaseNodesService } from '@/database-nodes/database-nodes.service';
import { ExecutionsService } from '@/executions/executions.service';
import { JobsService } from '@/jobs/jobs.service';
import { MailService } from '@/mail/mail.service';
import { ApplicationsService } from '@/applications/applications.service';
import { createAppRouter } from '@/trpc/app-router';
import { createContext } from '@/trpc/context';

describe('App (e2e)', () => {
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
  let testPipelineId: string;
  let testJobId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({
        sendRecoveryEmail: jest.fn().mockResolvedValue(undefined),
        sendInquiryEmail: jest.fn().mockResolvedValue(undefined),
        sendApplicationEmail: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const usersService = app.get(UsersService);
    const authService = app.get(AuthService);
    const jwtService = app.get(JwtService);

    const trpcRouter = createAppRouter({
      authService,
      aiService: app.get(AiService),
      billingService: app.get(BillingService),
      pipelinesService: app.get(PipelinesService),
      profileService: app.get(ProfileService),
      usersService,
      databaseNodesService: app.get(DatabaseNodesService),
      executionsService: app.get(ExecutionsService),
      jobsService: app.get(JobsService),
      mailService: app.get(MailService),
      applicationsService: app.get(ApplicationsService),
    });

    app
      .getHttpAdapter()
      .getInstance()
      .use(
        '/trpc',
        createExpressMiddleware({
          router: trpcRouter,
          createContext: ({ req, res }) =>
            createContext({ req, res }, { jwtService, usersService, authService }),
        }),
      );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prismaService.jobApplication.deleteMany({
      where: { jobId: testJobId },
    });
    await prismaService.job.deleteMany({
      where: { id: testJobId },
    });
    await prismaService.pipeline.deleteMany({
      where: { id: testPipelineId },
    });
    await prismaService.user.deleteMany({
      where: { email: testUser.email },
    });

    if (fs.existsSync('./uploads/applications')) {
      fs.rmSync('./uploads/applications', { recursive: true, force: true });
    }

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
      await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(409);
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

  describe('tRPC API', () => {
    beforeAll(async () => {
      const user = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });

      const pipeline = await prismaService.pipeline.create({
        data: {
          name: 'E2E Test Pipeline',
          status: 'DRAFT',
          userId: user!.id,
        },
      });
      testPipelineId = pipeline.id;
    });

    it('should reject tRPC protected route without auth (UNAUTHORIZED)', async () => {
      const res = await request(app.getHttpServer())
        .post('/trpc/users.updatePassword?batch=1')
        .send({ 0: { newPassword: 'test123' } })
        .expect(401);

      expect(res.body[0].error).toBeDefined();

      const errorCode = res.body[0].error.json?.data?.code ?? res.body[0].error.data?.code;

      expect(errorCode).toBe('UNAUTHORIZED');
    });

    it('should allow access to tRPC protected route with valid cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/trpc/users.setCurrentPipeline?batch=1')
        .set('Cookie', [accessTokenCookie])
        .send({ 0: { id: testPipelineId } })
        .expect(200);

      expect(res.body[0].result).toBeDefined();
      expect(res.body[0].result.data).toHaveProperty('id');
      expect(res.body[0].result.data.currentPipelineId).toBe(testPipelineId);
    });
  });

  describe('POST /applications (File Upload)', () => {
    beforeAll(async () => {
      const job = await prismaService.job.create({
        data: {
          slug: 'test-e2e-job',
          status: 'PUBLISHED',
          department: 'ENGINEERING',
          level: 'MID',
          type: 'FULL_TIME',
          location: 'Remote',
          views: 0,
          applications: 0,
        },
      });
      testJobId = job.id;
    });

    it('should upload a resume and create an application', async () => {
      const res = await request(app.getHttpServer())
        .post('/applications')
        .field('jobId', testJobId)
        .field('name', 'Test Applicant')
        .field('email', 'applicant@example.com')
        .field('company', 'Acme Corp')
        .field('position', 'Engineer')
        .field('message', 'I am a great fit.')
        .attach('resume', Buffer.from('fake pdf content'), 'resume.pdf')
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.resumeUrl).toContain(`/uploads/applications/${testJobId}/cvs/`);

      const updatedJob = await prismaService.job.findUnique({
        where: { id: testJobId },
      });
      expect(updatedJob?.applications).toBe(1);
    });

    it('should reject application without resume (400 Bad Request)', async () => {
      await request(app.getHttpServer())
        .post('/applications')
        .field('jobId', testJobId)
        .field('name', 'Test Applicant')
        .field('email', 'applicant@example.com')
        .field('company', 'Acme Corp')
        .field('position', 'Engineer')
        .field('message', 'I am a great fit.')
        .expect(400);
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
