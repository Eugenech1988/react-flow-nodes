import { ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { RecoveryDto } from './dtos/recovery.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { IUserSafe, IJwtPayload, IOauthUser } from './types/auth.types';
import { verify, hash } from 'argon2';

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
      const isMatch = await verify(user.password, pass);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateOauthUser(profile: IOauthUser): Promise<IUserSafe> {
    const existingUser = await this.usersService.findOneByProvider(profile.provider, profile.providerId);

    if (existingUser) {
      const { password, ...result } = existingUser;
      return result;
    }

    const emailUser = await this.usersService.findOneByEmail(profile.email);
    if (emailUser) {
      const updatedUser = await this.usersService.update(emailUser.id, {
        provider: profile.provider,
        providerId: profile.providerId,
        avatarUrl: emailUser.avatarUrl || profile.picture,
      });
      const { password, ...result } = updatedUser;
      return result;
    }

    const newUser = await this.usersService.create({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.picture,
      provider: profile.provider,
      providerId: profile.providerId,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async register(dto: RegisterDto): Promise<IUserSafe> {
    const candidate = await this.usersService.findOneByEmail(dto.email);
    if (candidate) {
      throw new ConflictException('A user with this email already exists');
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      nickName: dto.nickName,
    });

    const { password, ...result } = user;
    return result;
  }

  async generateTokens(userId: string) {
    const payload: IJwtPayload = { userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
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

    console.log(`Recovering token from ${clientUrl} ${resetToken}`, );

  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    let payload: any;

    try {
      payload = this.jwtService.verify(dto.token, {
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
}