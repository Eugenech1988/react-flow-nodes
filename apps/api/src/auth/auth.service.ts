import { ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { SigningOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { RecoveryDto } from './dtos/recovery.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { IUserSafe, IJwtPayload, IOauthUser } from './types/auth.types';
import { generateSecret,   verify as verifyOtp, generateURI } from 'otplib';
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

  async validateUser(email: string, pass: string): Promise<IUserSafe | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password) {
      const isMatch = await verifyArgon(user.password, pass);
      if (isMatch) {
        const { password, ...result } = user;
        return result as IUserSafe;
      }
    }
    return null;
  }

  async validateOauthUser(profile: IOauthUser): Promise<IUserSafe> {
    const existingUser = await this.usersService.findOneByProvider(profile.provider, profile.providerId);

    if (existingUser) {
      const { password, ...result } = existingUser;
      return result as IUserSafe;
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
            }
          }
        }
      });
      const { password, ...result } = updatedUser;
      return result as IUserSafe;
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
        }
      }
    });

    const { password, ...result } = newUser;
    return result as IUserSafe;
  }

  async register(dto: RegisterDto): Promise<IUserSafe> {
    const candidate = await this.usersService.findOneByEmail(dto.email);
    if (candidate) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await hash(dto.password);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      provider: 'local',
      providerId: dto.email,
      profile: {
        create: {
          firstName: dto.firstName || '',
          lastName: dto.lastName || null,
          nickName: dto.nickName || dto.email.split('@')[0],
        }
      }
    });

    const { password, ...result } = user;
    return result as IUserSafe;
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

  async recovery(dto: RecoveryDto): Promise<void> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) return;

    const resetToken = this.jwtService.sign(
      { userId: user.id, purpose: 'password_recovery' },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const clientUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:5173';
    const recoveryLink = `${clientUrl}/reset-password?token=${resetToken}`;

    console.log(`Recovering token from ${clientUrl} ${resetToken}`);
  }

  generateTempToken(userId: string) {
    const payload = { userId, purpose: '2fa_pending' };
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '5m',
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

    await this.usersService.update(userId, { isTwoFactorEnabled: true });
    return { success: true };
  }

  async turnOffTwoFactor(userId: string, code: string) {
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

    await this.usersService.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null,
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

    const result = await verifyOtp({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!result.valid) {
      throw new BadRequestException('Invalid authenticator code');
    }

    const { password, twoFactorSecret, ...resultUser } = user;
    return resultUser as IUserSafe;
  }
}