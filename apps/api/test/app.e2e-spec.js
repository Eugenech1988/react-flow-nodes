"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const cookieParser = require("cookie-parser");
const fs = __importStar(require("node:fs"));
const express_1 = require("@trpc/server/adapters/express");
const jwt_1 = require("@nestjs/jwt");
const app_module_1 = require("@/app.module");
const prisma_service_1 = require("@/prisma/prisma.service");
const users_service_1 = require("@/users/users.service");
const auth_service_1 = require("@/auth/auth.service");
const ai_service_1 = require("@/ai/ai.service");
const billing_service_1 = require("@/billing/billing.service");
const pipelines_service_1 = require("@/pipelines/pipelines.service");
const profile_service_1 = require("@/profile/profile.service");
const database_nodes_service_1 = require("@/database-nodes/database-nodes.service");
const executions_service_1 = require("@/executions/executions.service");
const jobs_service_1 = require("@/jobs/jobs.service");
const mail_service_1 = require("@/mail/mail.service");
const applications_service_1 = require("@/applications/applications.service");
const app_router_1 = require("@/trpc/app-router");
const context_1 = require("@/trpc/context");
describe('App (e2e)', () => {
    let app;
    let prismaService;
    const testUser = {
        email: 'e2e_user@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
    };
    let accessTokenCookie;
    let refreshTokenCookie;
    let testPipelineId;
    let testJobId;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(mail_service_1.MailService)
            .useValue({
            sendRecoveryEmail: jest.fn().mockResolvedValue(undefined),
            sendInquiryEmail: jest.fn().mockResolvedValue(undefined),
            sendApplicationEmail: jest.fn().mockResolvedValue(undefined),
        })
            .compile();
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        const usersService = app.get(users_service_1.UsersService);
        const authService = app.get(auth_service_1.AuthService);
        const jwtService = app.get(jwt_1.JwtService);
        const trpcRouter = (0, app_router_1.createAppRouter)({
            authService,
            aiService: app.get(ai_service_1.AiService),
            billingService: app.get(billing_service_1.BillingService),
            pipelinesService: app.get(pipelines_service_1.PipelinesService),
            profileService: app.get(profile_service_1.ProfileService),
            usersService,
            databaseNodesService: app.get(database_nodes_service_1.DatabaseNodesService),
            executionsService: app.get(executions_service_1.ExecutionsService),
            jobsService: app.get(jobs_service_1.JobsService),
            mailService: app.get(mail_service_1.MailService),
            applicationsService: app.get(applications_service_1.ApplicationsService),
        });
        app
            .getHttpAdapter()
            .getInstance()
            .use('/trpc', (0, express_1.createExpressMiddleware)({
            router: trpcRouter,
            createContext: ({ req, res }) => (0, context_1.createContext)({ req, res }, { jwtService, usersService, authService }),
        }));
        await app.init();
        prismaService = moduleFixture.get(prisma_service_1.PrismaService);
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
            accessTokenCookie = cookies?.find((c) => c.startsWith('accessToken='));
            refreshTokenCookie = cookies?.find((c) => c.startsWith('refreshToken='));
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
            expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
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
            accessTokenCookie = newCookies?.find((c) => c.startsWith('accessToken='));
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
                    userId: user.id,
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
