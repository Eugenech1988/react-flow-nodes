process.env.NODE_ENV = 'test';

jest.mock('otplib', () => ({
  generateSecret: jest.fn(),
  generateURI: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn(() => jest.fn()),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

const mockCsrfProtection = jest.fn();
const mockGenerateCsrfToken = jest.fn();
const mockTrpcMiddleware = jest.fn();
const mockAppUse = jest.fn();
const mockExpressUse = jest.fn();
const mockExpressGet = jest.fn();
const mockListen = jest.fn().mockResolvedValue(undefined);
const mockGetService = jest.fn();

const mockExpressApp = {
  use: mockExpressUse,
  get: mockExpressGet,
};

const mockApp = {
  enableCors: jest.fn(),
  useStaticAssets: jest.fn(),
  useGlobalPipes: jest.fn(),
  useBodyParser: jest.fn(),
  use: mockAppUse,
  get: mockGetService,
  getHttpAdapter: jest.fn(() => ({
    getInstance: () => mockExpressApp,
  })),
  listen: mockListen,
};

jest.mock('@/app.module', () => ({
  AppModule: class MockAppModule {},
}));

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue(mockApp),
  },
}));

jest.mock('csrf-csrf', () => ({
  doubleCsrf: jest.fn(() => ({
    generateCsrfToken: mockGenerateCsrfToken,
    doubleCsrfProtection: mockCsrfProtection,
  })),
}));

jest.mock('@trpc/server/adapters/express', () => ({
  createExpressMiddleware: jest.fn(() => mockTrpcMiddleware),
}));

jest.mock('@/trpc/app-router', () => ({
  createAppRouter: jest.fn().mockReturnValue({}),
}));

jest.mock('@/trpc/context', () => ({
  createContext: jest.fn(),
}));

jest.mock('cookie-parser', () => jest.fn(() => jest.fn()));

jest.mock('@nestjs/swagger', () => {
  const builder = {
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  };
  return {
    DocumentBuilder: jest.fn(() => builder),
    SwaggerModule: {
      setup: jest.fn(),
      createDocument: jest.fn().mockReturnValue({}),
    },
  };
});

import { doubleCsrf } from 'csrf-csrf';
import { createContext } from '@/trpc/context';
import { bootstrap } from './main';

describe('bootstrap', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetService.mockReturnValue({});
    mockApp.listen.mockResolvedValue(undefined);
  });

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, originalEnv);
  });

  describe('NestFactory', () => {
    it('should create app with rawBody: true for Stripe webhooks', async () => {
      const { NestFactory } = jest.requireMock('@nestjs/core');

      await bootstrap();

      expect(NestFactory.create).toHaveBeenCalledWith(expect.anything(), { rawBody: true });
    });
  });

  describe('CORS', () => {
    it('should use CLIENT_URL when it is set', async () => {
      process.env.CLIENT_URL = 'https://app.example.com';
      process.env.FRONTEND_URL = 'https://other.example.com';

      await bootstrap();

      expect(mockApp.enableCors).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'https://app.example.com',
          credentials: true,
        }),
      );
    });

    it('should fallback to FRONTEND_URL when CLIENT_URL is missing', async () => {
      delete process.env.CLIENT_URL;
      process.env.FRONTEND_URL = 'https://other.example.com';

      await bootstrap();

      expect(mockApp.enableCors).toHaveBeenCalledWith(
        expect.objectContaining({ origin: 'https://other.example.com' }),
      );
    });

    it('should fallback to localhost when both are missing', async () => {
      delete process.env.CLIENT_URL;
      delete process.env.FRONTEND_URL;

      await bootstrap();

      expect(mockApp.enableCors).toHaveBeenCalledWith(
        expect.objectContaining({ origin: 'http://localhost:5173' }),
      );
    });
  });

  describe('application setup', () => {
    it('should configure static assets, validation, body parsers and cookie parser', async () => {
      await bootstrap();

      expect(mockApp.useStaticAssets).toHaveBeenCalledWith(expect.stringContaining('uploads'), {
        prefix: '/uploads/',
      });
      expect(mockApp.useGlobalPipes).toHaveBeenCalled();
      expect(mockApp.useBodyParser).toHaveBeenCalledTimes(2);
      expect(mockApp.useBodyParser).toHaveBeenCalledWith('json', { limit: '10mb' });
      expect(mockApp.useBodyParser).toHaveBeenCalledWith('urlencoded', {
        extended: true,
        limit: '10mb',
      });
      expect(mockApp.use).toHaveBeenCalled();
    });

    it('should start listening on provided port or default 3000', async () => {
      process.env.PORT = '4000';

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith('4000');
    });

    it('should fallback to 3000 when PORT is missing', async () => {
      delete process.env.PORT;

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });
  });

  describe('tRPC middleware', () => {
    it('should mount tRPC at /trpc with context factory', async () => {
      await bootstrap();

      expect(mockExpressUse).toHaveBeenCalledWith('/trpc', mockTrpcMiddleware);
    });

    it('should build context using createContext, jwtService, usersService and authService', async () => {
      const { createExpressMiddleware } = jest.requireMock('@trpc/server/adapters/express');
      mockGetService.mockImplementation((token: unknown) => ({ token }));

      await bootstrap();

      const middlewareOptions = createExpressMiddleware.mock.calls[0][0];
      const req = { cookies: {} };
      const res = {};
      middlewareOptions.createContext({ req, res });

      expect(createContext).toHaveBeenCalledWith(
        { req, res },
        expect.objectContaining({
          jwtService: expect.anything(),
          usersService: expect.anything(),
          authService: expect.anything(),
        }),
      );
    });
  });

  describe('CSRF token endpoint', () => {
    it('should register GET /csrf-token and return token', async () => {
      mockGenerateCsrfToken.mockReturnValueOnce('csrf-xyz');
      const mockJson = jest.fn();
      const mockRes = { json: mockJson };

      await bootstrap();

      const csrfRouteCall = mockExpressGet.mock.calls.find(([path]) => path === '/csrf-token');
      expect(csrfRouteCall).toBeDefined();

      const handler = csrfRouteCall![1] as (req: unknown, res: unknown) => void;
      handler({}, mockRes);

      expect(mockGenerateCsrfToken).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({ csrfToken: 'csrf-xyz' });
    });
  });

  describe('CSRF middleware', () => {
    const getCsrfMiddleware = () => {
      const csrfCall = mockAppUse.mock.calls.find(
        (call: unknown[]) => typeof call[0] === 'function' && call[0].length === 3,
      );
      return csrfCall?.[0] as (req: { path: string }, res: unknown, next: jest.Mock) => void;
    };

    it('should bypass CSRF for excluded paths', async () => {
      await bootstrap();
      const middleware = getCsrfMiddleware();
      expect(middleware).toBeDefined();

      const excluded = [
        '/csrf-token',
        '/billing/webhook',
        '/stripe/webhook',
        '/inngest',
        '/trpc/users.login',
        '/applications',
      ];

      excluded.forEach((path) => {
        const next = jest.fn();
        middleware({ path }, {}, next);
        expect(next).toHaveBeenCalled();
        expect(mockCsrfProtection).not.toHaveBeenCalled();
      });
    });

    it('should apply CSRF protection for non-excluded paths', async () => {
      await bootstrap();
      const middleware = getCsrfMiddleware();
      expect(middleware).toBeDefined();

      const next = jest.fn();
      mockCsrfProtection.mockImplementationOnce((_req: unknown, _res: unknown, cb: jest.Mock) =>
        cb(),
      );

      middleware({ path: '/auth/login' }, {}, next);

      expect(mockCsrfProtection).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('doubleCsrf configuration', () => {
    it('should set secret and session identifier fallbacks', async () => {
      await bootstrap();

      const config = (doubleCsrf as unknown as jest.Mock).mock.calls[0][0];

      delete process.env.CSRF_SECRET;
      expect(config.getSecret()).toBe('default-secret-change-me');

      process.env.CSRF_SECRET = 'custom-secret';
      expect(config.getSecret()).toBe('custom-secret');

      expect(config.getSessionIdentifier({ cookies: { session: 'sess-1' }, ip: '1.1.1.1' })).toBe(
        'sess-1',
      );

      expect(config.getSessionIdentifier({ cookies: {}, ip: '1.1.1.1' })).toBe('1.1.1.1');
    });

    it('should mark cookie as secure only in production', async () => {
      process.env.NODE_ENV = 'production';
      await bootstrap();

      const config = (doubleCsrf as unknown as jest.Mock).mock.calls[0][0];
      expect(config.cookieOptions.secure).toBe(true);
    });

    it('should not mark cookie as secure outside production', async () => {
      process.env.NODE_ENV = 'test';
      await bootstrap();

      const config = (doubleCsrf as unknown as jest.Mock).mock.calls[0][0];
      expect(config.cookieOptions.secure).toBe(false);
    });
  });

  describe('Swagger', () => {
    it('should configure Swagger at /api/docs', async () => {
      const { SwaggerModule } = jest.requireMock('@nestjs/swagger');

      await bootstrap();

      expect(SwaggerModule.setup).toHaveBeenCalledWith('api/docs', mockApp, expect.any(Function));
    });

    it('should generate Swagger document from callback', async () => {
      const { SwaggerModule } = jest.requireMock('@nestjs/swagger');

      await bootstrap();

      const setupCallback = SwaggerModule.setup.mock.calls[0][2] as () => unknown;
      setupCallback();

      expect(SwaggerModule.createDocument).toHaveBeenCalledWith(mockApp, expect.anything());
    });
  });
});
