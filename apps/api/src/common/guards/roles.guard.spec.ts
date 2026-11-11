import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';

type RequestWithUser = Omit<Request, 'user'> & {
  user?: { role: Role } | null;
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector) as jest.Mocked<Reflector>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockContext = (user?: { role: Role } | null): ExecutionContext => {
    const mockRequest = { user } as RequestWithUser;

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;
  };

  it('should allow access if no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = mockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if required roles array is empty', () => {
    reflector.getAllAndOverride.mockReturnValue([]);
    const context = mockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user is missing', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.SUPER_ADMIN]);
    const context = mockContext(null);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user role does not match', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.SUPER_ADMIN]);
    const context = mockContext({ role: Role.USER });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if user has one of the required roles', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.CONTENT_MANAGER, Role.SUPER_ADMIN]);
    const context = mockContext({ role: Role.CONTENT_MANAGER });
    expect(guard.canActivate(context)).toBe(true);
  });
});
