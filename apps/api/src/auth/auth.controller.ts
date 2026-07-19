import { Controller, Post, Body, Res, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/current-user.deacorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GoogleOauthGuard } from './guards/google.guard';
import { GithubOauthGuard } from './guards/github.guard';
import { IGoogleUser } from './types/google-user.types';
import { IGithubUser } from './types/github-user.types';
import type { User } from '@prisma/client';

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

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async google() {}

  @UseGuards(GithubOauthGuard)
  @Get('github')
  async github() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User data missing from Google provider');
    }
    await this.authService.googleAuth(req.user as IGoogleUser, res);
    return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }

  @UseGuards(GithubOauthGuard)
  @Get('github/callback')
  async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User data missing from GitHub provider');
    }
    await this.authService.githubAuth(req.user as IGithubUser, res);
    return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    return user;
  }
}