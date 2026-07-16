import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import type { Response } from 'express';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/current-user.deacorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(registerDto, res);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.generateTokens(userId, res);

    return { success: true, userId };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.generateTokens(userId, res);

    return { success: true, userId };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '');
  }
}
