import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { AuthService } from '@/auth/auth.service';
import { BillingService } from '@/billing/billing.service';
import { PipelinesService } from '@/pipelines/pipelines.service';
import { ProfileService } from '@/profile/profile.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createAppRouter } from '@/trpc/app-router';
import { createContext } from '@/trpc/context';
import { AiService } from '@/ai/ai.service';
import { DatabaseNodesService } from '@/database-nodes/database-nodes.service';
import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.enableCors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-csrf-token',
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '10mb' });

  app.use(cookieParser());

  const csrf = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'default-secret-change-me',
    getSessionIdentifier: (req) => req.cookies?.['session'] || req.ip,
    cookieName: 'x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  });

  const generateCsrfToken = csrf.generateCsrfToken;
  const doubleCsrfProtection = csrf.doubleCsrfProtection;

  app.use((req, res, next) => {
    if (
      req.path.startsWith('/api/docs') ||
      req.path.startsWith('/csrf-token')
    ) {
      return next();
    }
    return doubleCsrfProtection(req, res, next);
  });

  const usersService = app.get(UsersService);
  const authService = app.get(AuthService);
  const jwtService = app.get(JwtService);

  const router = createAppRouter({
    authService,
    aiService: app.get(AiService),
    billingService: app.get(BillingService),
    pipelinesService: app.get(PipelinesService),
    profileService: app.get(ProfileService),
    usersService,
    databaseNodesService: app.get(DatabaseNodesService),
  });

  app.getHttpAdapter().getInstance().use(
    '/trpc',
    createExpressMiddleware({
      router,
      createContext: ({ req, res }) =>
        createContext({ req, res }, { jwtService, usersService, authService }),
    }),
  );

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/csrf-token', (req, res) => {
    const token = generateCsrfToken(req, res);
    res.json({ csrfToken: token });
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pipeline Studio API')
    .setDescription('The API documentation for Pipeline Studio backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api/docs', app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();