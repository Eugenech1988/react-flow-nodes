import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '@/users/users.service';
import { IJwtPayload, TUserSafe } from '@/auth/types/auth.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['accessToken'] || null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<TUserSafe> {
    const user = await this.usersService.findOneById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, twoFactorSecret, recoveryCodes, ...safeUser } = user as Record<string, any>;
    return safeUser as TUserSafe;
  }
}