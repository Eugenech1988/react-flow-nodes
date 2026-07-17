import { verify } from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { IGoogleUser } from './types/google-user.types';
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
    const createdUser = await this.usersService.create(registerDto as unknown as CreateUserDto);
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

    const generatedNick = googleUser.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);

    let user = await this.usersService.findOneByEmail(googleUser.email);

    if (!user) {
      const newUser = await this.usersService.create({
        email: googleUser.email,
        password: '',
        nickName: generatedNick,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        avatarUrl: googleUser.picture,
      } as CreateUserDto);

      user = { ...newUser, password: '' };
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