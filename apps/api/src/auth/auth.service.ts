import { verify } from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { IGoogleUser } from './types/google-user.types';
import { IGithubUser } from './types/github-user.types';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const createdUser = await this.usersService.create(registerDto as CreateUserDto);
    await this.generateTokens(createdUser.id, res);
    const { password: _, ...result } = createdUser;
    return result;
  }

  async login(user: { id: string; password?: string }, res: Response) {
    await this.generateTokens(user.id, res);
    return { id: user.id };
  }

  async googleAuth(googleUser: IGoogleUser, res: Response) {
    if (!googleUser || !googleUser.providerId) {
      throw new UnauthorizedException('Google authentication failed – missing providerId');
    }

    let user = await this.usersService.findOneByProvider('google', googleUser.providerId);

    if (!user && googleUser.email) {
      user = await this.usersService.findOneByEmail(googleUser.email);
      if (user) {
        await this.usersService.update(user.id, {
          provider: 'google',
          providerId: googleUser.providerId,
        } as any); // если TS всё ещё ругается, можно использовать as any
      }
    }

    if (!user) {
      const email = googleUser.email || `${googleUser.providerId}@google.placeholder`;
      const nickName = `google_${googleUser.providerId.slice(0, 8)}`;

      user = await this.usersService.create({
        email,
        password: '',
        nickName,
        firstName: googleUser.firstName || '',
        lastName: googleUser.lastName || '',
        avatarUrl: googleUser.picture || '',
        provider: 'google',
        providerId: googleUser.providerId,
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found after authentication');
    }

    await this.generateTokens(user.id, res);
    const { password: _, ...result } = user;
    return result;
  }

  async githubAuth(githubUser: IGithubUser, res: Response) {
    if (!githubUser || !githubUser.providerId) {
      throw new UnauthorizedException('GitHub authentication failed – missing providerId');
    }

    let user = await this.usersService.findOneByProvider('github', githubUser.providerId);

    if (!user && githubUser.email) {
      user = await this.usersService.findOneByEmail(githubUser.email);
      if (user) {
        await this.usersService.update(user.id, {
          provider: 'github',
          providerId: githubUser.providerId,
        } as any);
      }
    }

    if (!user) {
      const email = githubUser.email || `${githubUser.providerId}@github.placeholder`;
      const nickName = `gh_${githubUser.providerId.slice(0, 8)}`;

      user = await this.usersService.create({
        email,
        password: '',
        nickName,
        firstName: githubUser.firstName || '',
        lastName: githubUser.lastName || '',
        avatarUrl: githubUser.picture || '',
        provider: 'github',
        providerId: githubUser.providerId,
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found after authentication');
    }

    await this.generateTokens(user.id, res);
    const { password: _, ...result } = user;
    return result;
  }

  async generateTokens(userId: string, res: Response): Promise<void> {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
      },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  async validateUser(email: string, password: string): Promise<{ id: string } | null> {
    const userByEmail = await this.usersService.findOneByEmail(email);

    if (!userByEmail) {
      return null;
    }

    if (!userByEmail.password) {
      throw new UnauthorizedException('Please log in using Google or reset your password');
    }

    const isValidPw = await verify(userByEmail.password, password);

    if (!isValidPw) {
      return null;
    }

    return userByEmail;
  }
}