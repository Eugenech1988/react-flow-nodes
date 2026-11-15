import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { UsersService, type UserWithRelations } from '../users/users.service.js';
import { AuthService } from '../auth/auth.service.js';
export interface ITrpcServices {
  jwtService: JwtService;
  usersService: UsersService;
  authService: AuthService;
}
export type TrpcContext = {
  req: Request;
  res: Response;
  user: UserWithRelations | null;
};
export declare const createContext: (
  {
    req,
    res,
  }: {
    req: Request;
    res: Response;
  },
  services: ITrpcServices,
) => Promise<TrpcContext>;
