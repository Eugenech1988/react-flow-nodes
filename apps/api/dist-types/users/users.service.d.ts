import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import type { TRegisterInputData, TUpdatePasswordInputData } from '@pipeline/contracts';
declare const userWithRelationsValidator: {
  include: {
    profile: true;
    subscription: true;
    currentPipeline: true;
  };
};
export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelationsValidator>;
export declare const safeUserSelect: {
  id: true;
  email: true;
  hasPassword: true;
  provider: true;
  providerId: true;
  currentPipelineId: true;
  role: true;
  createdAt: true;
  updatedAt: true;
  profile: true;
  subscription: true;
  currentPipeline: true;
};
export type SafeUserWithRelations = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;
export type TCreateUserInputData = TRegisterInputData & {
  avatarUrl?: string;
  provider?: string;
  providerId?: string;
};
export declare class UsersService {
  private readonly prisma;
  constructor(prisma: PrismaService);
  findAll(): Promise<SafeUserWithRelations[]>;
  register(createUserDto: TCreateUserInputData): Promise<UserWithRelations>;
  create(data: Prisma.UserCreateInput): Promise<UserWithRelations>;
  findOneByEmail(email: string): Promise<UserWithRelations | null>;
  findOneByProvider(provider: string, providerId: string): Promise<UserWithRelations | null>;
  findOneById(id: string): Promise<UserWithRelations | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<UserWithRelations>;
  updatePassword(
    id: string,
    dto: TUpdatePasswordInputData,
  ): Promise<{
    success: boolean;
  }>;
  delete(id: string): Promise<void>;
  setCurrentPipeline(userId: string, pipelineId: string): Promise<UserWithRelations>;
}
export {};
