import { User as PrismaUser, Profile as PrismaProfile } from '@prisma/client';

export type IProfileSafe = PrismaProfile;

export type IUserSafe = Omit<PrismaUser, 'password'> & {
  profile: IProfileSafe | null;
};