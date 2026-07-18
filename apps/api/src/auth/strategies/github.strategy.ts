import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { IGithubUser } from '../types/github-user.types';

interface GithubEmail {
  value: string;
  primary?: boolean;
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
    done: (error: Error | null, user: IGithubUser | false) => void,
  ): Promise<void> {
    const { displayName, username, emails, photos } = profile;

    const githubEmails = (emails || []) as GithubEmail[];

    const primaryEmail = githubEmails.find((e) => e.primary)?.value;
    const fallbackEmail = githubEmails[0]?.value;

    const email = primaryEmail || fallbackEmail || `${username || 'unknown'}@github.placeholder`;

    const nameParts = displayName?.split(' ') || [];
    const firstName = nameParts[0] || username || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const user: IGithubUser = {
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