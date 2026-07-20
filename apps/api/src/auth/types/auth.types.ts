import { User as PrismaUser, Profile as PrismaProfile } from '@prisma/client';

export type IProfileSafe = PrismaProfile;

export type IUserSafe = Omit<PrismaUser, 'password'> & {
  profile: IProfileSafe | null;
};

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
  provider: 'google' | 'github' | ' local';
}