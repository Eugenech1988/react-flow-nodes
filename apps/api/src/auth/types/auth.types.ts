import { User as PrismaUser } from '@prisma/client';

export type IUserSafe = Omit<PrismaUser, 'password'>;

export interface IJwtPayload {
  userId: string;
}

export interface IOauthUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
  providerId: string;
  provider: 'google' | 'github';
}