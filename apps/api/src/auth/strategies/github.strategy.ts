import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import type { IOauthUser } from '../types/auth.types';

interface GithubApiEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') || '',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user: IOauthUser | false) => void,
  ): Promise<void> {
    const { displayName, username, photos } = profile;
    let email = '';

    try {
      const response = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'NestJS-Auth-App',
          Accept: 'application/vnd.github+json',
        },
      });

      if (response.ok) {
        const emails = (await response.json()) as GithubApiEmail[];
        const primaryEmail = emails.find((e) => e.primary);
        const verifiedEmail = emails.find((e) => e.verified);

        email = primaryEmail?.email || verifiedEmail?.email || emails[0]?.email || '';
      }
    } catch (error) {
      console.error('Failed to fetch GitHub private emails:', error);
    }

    if (!email) {
      email = `${username || 'unknown'}_${profile.id}@github.placeholder`;
    }

    const nameParts = displayName?.split(' ') || [];
    const firstName = nameParts[0] || username || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const user: IOauthUser = {
      email,
      firstName,
      lastName,
      picture: photos?.[0]?.value || '',
      accessToken,
      refreshToken,
      providerId: profile.id,
      provider: 'github',
    };

    done(null, user);
  }
}