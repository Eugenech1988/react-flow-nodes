import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { verify } from 'argon2';
import { IGoogleUser } from './types/google-user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const createdUser = await this.usersService.create(registerDto);
    await this.generateTokens(createdUser.id, res);
    return createdUser;
  }

  async login(user: { id: string; password?: string }, res: Response) {
    await this.generateTokens(user.id, res);
    const { password: _, ...result } = user;
    return result;
  }

  async googleAuth(googleUser: IGoogleUser, res: Response) {
    if (!googleUser || !googleUser.email) {
      throw new UnauthorizedException('Google authentication failed');
    }

    let user = await this.usersService.findOneByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        password: '',
        nickName: '',
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
      });
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

    const isValidPw = await verify(userByEmail.password, password);

    if (!isValidPw) {
      return null;
    }

    return userByEmail;
  }
}