import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { UsersService, type UserWithRelations } from '@/users/users.service';
import { AuthService } from '@/auth/auth.service';

export interface TrpcServices {
  jwtService: JwtService;
  usersService: UsersService;
  authService: AuthService;
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production';
  const baseOptions = { httpOnly: true, secure, sameSite: 'lax' as const };

  res.cookie('accessToken', accessToken, { ...baseOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...baseOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function createContext(
  { req, res }: { req: Request; res: Response },
  services: TrpcServices,
) {
  const accessToken = req.cookies?.accessToken as string | undefined;
  const refreshToken = req.cookies?.refreshToken as string | undefined;
  let user: UserWithRelations | null = null;

  if (accessToken) {
    try {
      const payload = await services.jwtService.verifyAsync<{ userId: string }>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      user = await services.usersService.findOneById(payload.userId);
    } catch {
      user = null;
    }
  }

  if (!user && refreshToken) {
    try {
      const payload = await services.jwtService.verifyAsync<{ userId: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const dbUser = await services.usersService.findOneById(payload.userId);
      if (dbUser) {
        user = dbUser;
        const tokens = await services.authService.generateTokens(user.id);
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
      }
    } catch {
      user = null;
    }
  }

  return { req, res, user };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;