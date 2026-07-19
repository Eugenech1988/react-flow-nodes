import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async update(userId: string, updateProfileDto: UpdateProfileDto, avatarFile?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarUrl = user.profile?.avatarUrl;

    if (avatarFile) {
      avatarUrl = `/uploads/avatars/${avatarFile.filename}`;
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            upsert: {
              create: {
                firstName: updateProfileDto.firstName || '',
                lastName: updateProfileDto.lastName || null,
                company: updateProfileDto.company || null,
                location: updateProfileDto.location || null,
                jobTitle: updateProfileDto.jobTitle || null,
                avatarUrl: avatarUrl || null,
                nickName: user.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 5),
              },
              update: {
                firstName: updateProfileDto.firstName,
                lastName: updateProfileDto.lastName,
                company: updateProfileDto.company,
                location: updateProfileDto.location,
                jobTitle: updateProfileDto.jobTitle,
                avatarUrl: avatarUrl,
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