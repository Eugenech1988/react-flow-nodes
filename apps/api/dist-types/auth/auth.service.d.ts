import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService, UserWithRelations } from '../users/users.service.js';
import { MailService } from '../mail/mail.service.js';
import type {
  TRegisterInputData,
  TRequestResetInputData,
  TPasswordResetInputData,
} from '@pipeline/contracts';
import { TUserSafe, TOauthUser } from './types/auth.types.js';
import { PrismaService } from '../prisma/prisma.service.js';
export declare class AuthService {
  private readonly usersService;
  private readonly jwtService;
  private readonly configService;
  private readonly mailService;
  private readonly prisma;
  constructor(
    usersService: UsersService,
    jwtService: JwtService,
    configService: ConfigService,
    mailService: MailService,
    prisma: PrismaService,
  );
  private generateRecoveryCodes;
  private sanitizeUser;
  validateUser(email: string, pass: string): Promise<TUserSafe | null>;
  validateOauthUser(profile: TOauthUser): Promise<TUserSafe>;
  register(dto: TRegisterInputData): Promise<TUserSafe>;
  validateRefreshToken(refreshToken: string): Promise<UserWithRelations | null>;
  updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void>;
  generateTokens(
    userId: string,
    userAgent?: string,
    ip?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  logout(refreshToken: string): Promise<void>;
  recovery(dto: TRequestResetInputData): Promise<string | null>;
  generateTempToken(userId: string): string;
  resetPassword(dto: TPasswordResetInputData): Promise<void>;
  publicRequestResetPassword(dto: TRequestResetInputData): Promise<{
    message: string;
  }>;
  publicResetPassword(dto: TPasswordResetInputData): Promise<{
    success: boolean;
  }>;
  generateTwoFactorSecret(userId: string): Promise<{
    qrCodeImage: string;
    secret: string;
  }>;
  turnOnTwoFactor(
    userId: string,
    code: string,
  ): Promise<{
    success: boolean;
    recoveryCodes: string[];
  }>;
  turnOffTwoFactor(
    userId: string,
    code: string,
  ): Promise<{
    success: boolean;
  }>;
  authenticateWith2Fa(tempToken: string, code: string): Promise<TUserSafe>;
  regenerateRecoveryCodes(userId: string): Promise<{
    recoveryCodes: string[];
  }>;
}
