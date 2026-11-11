import { createContext, type ITrpcServices } from '@/trpc/context';
import type { Request, Response } from 'express';
import type { UserWithRelations } from '@/users/users.service';

const createMockReq = (cookies: Record<string, string> = {}): Request =>
  ({ cookies }) as unknown as Request;

const createMockRes = (): Response => ({}) as Response;

type TMockServices = {
  jwtService: { verifyAsync: jest.Mock };
  usersService: { findOneById: jest.Mock };
  authService: Record<string, unknown>;
};

const createMockServices = (): TMockServices => ({
  jwtService: { verifyAsync: jest.fn() },
  usersService: { findOneById: jest.fn() },
  authService: {},
});

const mockUser = { id: 'user_1' } as UserWithRelations;

describe('createContext', () => {
  it('returns null user when no access token', async () => {
    const services = createMockServices();

    const ctx = await createContext(
      { req: createMockReq(), res: createMockRes() },
      services as unknown as ITrpcServices,
    );

    expect(ctx.user).toBeNull();
    expect(services.jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('returns user when token is valid and user exists', async () => {
    const services = createMockServices();
    services.jwtService.verifyAsync.mockResolvedValue({ userId: 'user_1' });
    services.usersService.findOneById.mockResolvedValue(mockUser);

    const ctx = await createContext(
      { req: createMockReq({ accessToken: 'token_abc' }), res: createMockRes() },
      services as unknown as ITrpcServices,
    );

    expect(services.jwtService.verifyAsync).toHaveBeenCalledWith('token_abc', {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    expect(services.usersService.findOneById).toHaveBeenCalledWith('user_1');
    expect(ctx.user).toEqual(mockUser);
  });

  it('returns null user when token verification fails', async () => {
    const services = createMockServices();
    services.jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const ctx = await createContext(
      { req: createMockReq({ accessToken: 'bad_token' }), res: createMockRes() },
      services as unknown as ITrpcServices,
    );

    expect(ctx.user).toBeNull();
  });

  it('returns null user when user is not found', async () => {
    const services = createMockServices();
    services.jwtService.verifyAsync.mockResolvedValue({ userId: 'missing' });
    services.usersService.findOneById.mockResolvedValue(null);

    const ctx = await createContext(
      { req: createMockReq({ accessToken: 'token_abc' }), res: createMockRes() },
      services as unknown as ITrpcServices,
    );

    expect(ctx.user).toBeNull();
  });
});
