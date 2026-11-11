import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { UsersService, type UserWithRelations } from '@/users/users.service';
import { AuthService } from '@/auth/auth.service';

export interface ITrpcServices {
  jwtService: JwtService;
  usersService: UsersService;
  authService: AuthService;
}

export const createContext = async (
  { req, res }: { req: Request; res: Response },
  services: ITrpcServices,
) => {
  const accessToken = req.cookies?.accessToken as string | undefined;

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

  return { req, res, user };
};

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
