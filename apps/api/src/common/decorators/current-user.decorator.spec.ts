import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import type { Request } from 'express';
import { CurrentUser } from './current-user.decorator';

type RequestWithUser = Omit<Request, 'user'> & {
  user?: Record<string, unknown>;
};

interface RouteArgMetadataEntry {
  factory: (data: unknown, ctx: ExecutionContext) => unknown;
  data: unknown;
  index: number;
  pipes: unknown[];
}

describe('CurrentUser Decorator', () => {
  const mockUser = { id: 'user_1', email: 'test@example.com', role: 'USER' };

  class TestController {
    public testMethod(@CurrentUser() _value: unknown) {}
  }

  const getDecoratorFactory = (): ((data: unknown, ctx: ExecutionContext) => unknown) => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'testMethod') as Record<
      string,
      RouteArgMetadataEntry
    >;

    const firstKey = Object.keys(args)[0];
    return args[firstKey].factory;
  };

  const createMockContext = (user?: Record<string, unknown>): ExecutionContext => {
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

  it('should return the whole user object if no data key is provided', () => {
    const factory = getDecoratorFactory();
    const context = createMockContext(mockUser);
    const result = factory(undefined, context);
    expect(result).toEqual(mockUser);
  });

  it('should return a specific user property if data key is provided', () => {
    const factory = getDecoratorFactory();
    const context = createMockContext(mockUser);
    const result = factory('email', context);
    expect(result).toBe('test@example.com');
  });

  it('should return null if user is not in request', () => {
    const factory = getDecoratorFactory();
    const context = createMockContext(undefined);
    const result = factory(undefined, context);
    expect(result).toBeNull();
  });
});
