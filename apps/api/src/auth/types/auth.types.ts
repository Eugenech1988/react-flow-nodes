import { User as PrismaUser, Profile as PrismaProfile, Subscription as PrismaSubscription } from '@prisma/client';

export type TDescriptionSafe = PrismaSubscription;

export type TProfileSafe = PrismaProfile;

export type TUserSafe = Omit<PrismaUser, 'password'> & {
  profile: TProfileSafe | null;
};

export type TJwtPayload = {
  userId: string;
}

export type TOauthUser = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  providerId: string;
  provider: 'google' | 'github' | ' local';
}