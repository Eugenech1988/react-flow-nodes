import { PrismaService } from '../prisma/prisma.service.js';
import type { TUpdateProfileInputData } from '@pipeline/contracts';
export declare class ProfileService {
  private readonly prisma;
  constructor(prisma: PrismaService);
  update(
    userId: string,
    input: TUpdateProfileInputData,
  ): Promise<
    {
      profile: {
        firstName: string;
        lastName: string | null;
        nickName: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        company: string | null;
        location: string | null;
        jobTitle: string | null;
        avatarUrl: string | null;
      } | null;
    } & {
      email: string;
      password: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasPassword: boolean;
      role: import('@prisma/client').$Enums.Role;
      provider: string;
      providerId: string;
      isTwoFactorEnabled: boolean;
      twoFactorSecret: string | null;
      recoveryCodes: string[];
      currentPipelineId: string | null;
    }
  >;
}
