import { User as PrismaUser, Profile as PrismaProfile } from '@prisma/client';

export type IProfileSafe = PrismaProfile;

export type TUserSafe = Omit<PrismaUser, 'password'> & {
  profile: IProfileSafe | null;
};