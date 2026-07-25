import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SigningOptions } from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from '@/auth/dtos/register.dto';
import { RecoveryDto } from '@/auth/dtos/recovery.dto';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';
import { TUserSafe, IJwtPayload, IOauthUser } from '@/auth/types/auth.types';
import { generateSecret, verify as verifyOtp, generateURI } from 'otplib';
import * as qrcode from 'qrcode';
import { verify as verifyArgon, hash } from 'argon2';

interface IResetPasswordPayload {
  userId: string;
  purpose: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateRecoveryCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  async validateUser(email: string, pass: string): Promise<TUserSafe | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password) {
      const isMatch = await verifyArgon(user.password, pass);
      if (isMatch) {
        const { password, ...result } = user;
        return result as TUserSafe;
      }
    }
    return null;
  }

  async validateOauthUser(profile: IOauthUser): Promise<TUserSafe> {
    const existingUser = await this.usersService.findOneByProvider(profile.provider, profile.providerId);

    if (existingUser) {
      const { password, ...result } = existingUser;
      return result as TUserSafe;
    }

    const emailUser = await this.usersService.findOneByEmail(profile.email);
    if (emailUser) {
      const updatedUser = await this.usersService.update(emailUser.id, {
        provider: profile.provider,
        providerId: profile.providerId,
        profile: {
          upsert: {
            create: {
              avatarUrl: profile.picture,
              firstName: profile.firstName,
              lastName: profile.lastName,
            },
            update: {
              avatarUrl: emailUser.profile?.avatarUrl || profile.picture,
            },
          },
        },
      });
      const { password, ...result } = updatedUser;
      return result as TUserSafe;
    }

    const newUser = await this.usersService.create({
      email: profile.email,
      provider: profile.provider,
      providerId: profile.providerId,
      profile: {
        create: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.picture,
        },
      },
    });

    const { password, ...result } = newUser;
    return result as TUserSafe;
  }

  async register(dto: RegisterDto): Promise<TUserSafe> {
    const user = await this.usersService.register({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      nickName: dto.nickName,
    });

    const { password, ...result } = user;
    return result as TUserSafe;
  }

  async generateTokens(userId: string) {
    const payload: IJwtPayload = { userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES') as SigningOptions,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES') as SigningOptions,
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    let payload: IJwtPayload;

    try {
      payload = this.jwtService.verify<IJwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findOneById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id);
  }

  async recovery(dto: RecoveryDto): Promise<string | null> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) return null;

    const resetToken = this.jwtService.sign(
      { userId: user.id, purpose: 'password_recovery' },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES') as SigningOptions,
      },
    );

    const clientUrl = this.configService.get<string>('CLIENT_URL') || this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return `${clientUrl}/reset-password?token=${resetToken}`;
  }

  generateTempToken(userId: string) {
    const payload = { userId, purpose: '2fa_pending' };
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TEMP_EXPIRES') as SigningOptions,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    let payload: IResetPasswordPayload;

    try {
      payload = this.jwtService.verify<IResetPasswordPayload>(dto.token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired recovery token');
    }

    if (payload.purpose !== 'password_recovery') {
      throw new BadRequestException('Invalid token purpose');
    }

    const hashedPassword = await hash(dto.password);

    await this.usersService.update(payload.userId, {
      password: hashedPassword,
    });
  }

  async generateTwoFactorSecret(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = generateSecret();

    const otpauthUrl = generateURI({
      issuer: 'MyAppName',
      label: user.email,
      secret,
    });

    const qrCodeImage = await qrcode.toDataURL(otpauthUrl);

    await this.usersService.update(userId, { twoFactorSecret: secret });

    return {
      qrCodeImage,
      secret,
    };
  }

  async turnOnTwoFactor(userId: string, code: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not initialized');
    }

    const result = await verifyOtp({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!result.valid) {
      throw new BadRequestException('Invalid authenticator code');
    }

    const rawRecoveryCodes = this.generateRecoveryCodes();

    const hashedCodes = await Promise.all(
      rawRecoveryCodes.map((c) => hash(c))
    );

    await this.usersService.update(userId, {
      isTwoFactorEnabled: true,
      recoveryCodes: hashedCodes,
    });

    return {
      success: true,
      recoveryCodes: rawRecoveryCodes,
    };
  }

  async turnOffTwoFactor(userId: string, code: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not initialized');
    }

    let isValid = (
      await verifyOtp({
        token: code,
        secret: user.twoFactorSecret
      })).valid;

    if (!isValid && user.recoveryCodes?.length) {
      for (const hashedCode of user.recoveryCodes) {
        if (await verifyArgon(hashedCode, code)) {
          isValid = true;
          break;
        }
      }
    }

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
      recoveryCodes: [],
    });

    return { success: true };
  }

  async authenticateWith2Fa(tempToken: string, code: string) {
    let payload: { userId: string; purpose: string };
    try {
      payload = this.jwtService.verify(tempToken, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired temporary token');
    }

    if (payload.purpose !== '2fa_pending') {
      throw new BadRequestException('Invalid token purpose');
    }

    const user = await this.usersService.findOneById(payload.userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('User not found or 2FA not set up');
    }

    const otpResult = await verifyOtp({
      token: code,
      secret: user.twoFactorSecret,
    });

    let isVerified = otpResult.valid;
    let usedCodeIndex = -1;

    if (!isVerified && user.recoveryCodes?.length) {
      for (let i = 0; i < user.recoveryCodes.length; i++) {
        if (await verifyArgon(user.recoveryCodes[i], code)) {
          isVerified = true;
          usedCodeIndex = i;
          break;
        }
      }
    }

    if (!isVerified) {
      throw new BadRequestException('Invalid authenticator code');
    }

    if (usedCodeIndex !== -1) {
      const updatedCodes = user.recoveryCodes.filter((_, idx) => idx !== usedCodeIndex);
      await this.usersService.update(user.id, { recoveryCodes: updatedCodes });
    }

    const { password, twoFactorSecret, recoveryCodes, ...resultUser } = user;
    return resultUser as unknown as TUserSafe;
  }

  async regenerateRecoveryCodes(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.isTwoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled');
    }

    const rawRecoveryCodes = this.generateRecoveryCodes();
    const hashedCodes = await Promise.all(
      rawRecoveryCodes.map((c) => hash(c))
    );

    await this.usersService.update(userId, {
      recoveryCodes: hashedCodes,
    });

    return { recoveryCodes: rawRecoveryCodes };
  }
}