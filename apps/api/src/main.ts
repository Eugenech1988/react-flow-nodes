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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.enableCors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());

  const usersService = app.get(UsersService);
  const authService = app.get(AuthService);
  const jwtService = app.get(JwtService);

  const router = createAppRouter({
    authService,
    billingService: app.get(BillingService),
    pipelinesService: app.get(PipelinesService),
    profileService: app.get(ProfileService),
    usersService,
  });

  app.getHttpAdapter().getInstance().use(
    '/trpc',
    createExpressMiddleware({
      router,
      createContext: ({ req, res }) =>
        createContext({ req, res }, { jwtService, usersService, authService }),
    }),
  );

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