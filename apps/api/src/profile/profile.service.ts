import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TUpdateProfileInputData } from '@pipeline/contracts';
import { AVATAR_UPLOAD_DIR, ensureAvatarDir } from './profile.helpers';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async update(userId: string, input: TUpdateProfileInputData) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let finalAvatarUrl = input.avatarUrl ?? user.profile?.avatarUrl;

    if (input.avatarUrl && input.avatarUrl.startsWith('data:image')) {
      ensureAvatarDir();

      const match = input.avatarUrl.match(/^data:image\/(\w+);base64,/);
      const ext = match ? `.${match[1]}` : '.jpg';
      const base64Data = input.avatarUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}${ext}`;
      const filePath = join(AVATAR_UPLOAD_DIR, filename);

      writeFileSync(filePath, buffer);
      finalAvatarUrl = `/uploads/avatars/${filename}`;
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            upsert: {
              create: {
                firstName: input.firstName || '',
                lastName: input.lastName || null,
                company: input.company || null,
                location: input.location || null,
                jobTitle: input.jobTitle || null,
                avatarUrl: finalAvatarUrl || null,
                nickName:
                  user.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 5),
              },
              update: {
                firstName: input.firstName,
                lastName: input.lastName,
                company: input.company,
                location: input.location,
                jobTitle: input.jobTitle,
                avatarUrl: finalAvatarUrl,
              },
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new InternalServerErrorException('Error updating profile');
    }
  }
}
