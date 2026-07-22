import { ConflictException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { Toggle2faDto } from './dtos/toggle-2fa.dto';
import { Prisma } from '@prisma/client';
import { hash, verify } from 'argon2';

const userWithRelationsValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { profile: true, subscription: true },
});

export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelationsValidator>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserWithRelations[]> {
    try {
      return await this.prisma.user.findMany({
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new InternalServerErrorException('An unexpected error occurred while fetching users');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<UserWithRelations> {
    const { email, password, firstName, lastName, avatarUrl, provider, providerId } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = password ? await hash(password) : '';

    let nickName = createUserDto.nickName;
    if (!nickName) {
      nickName = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);
    }

    const existingProfile = await this.prisma.profile.findFirst({ where: { nickName } });
    if (existingProfile) {
      nickName = `${nickName}_${Math.random().toString(36).substring(2, 5)}`;
    }

    return this.create({
      email,
      password: hashedPassword,
      provider: provider || 'local',
      providerId: providerId || email,
      profile: {
        create: {
          nickName,
          firstName: firstName || '',
          lastName: lastName || null,
          avatarUrl: avatarUrl || null,
        },
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserWithRelations> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data,
          include: { profile: true, subscription: true },
        });

        const existingSub = await tx.subscription.findUnique({ where: { userId: user.id } });
        if (!existingSub) {
          await tx.subscription.create({
            data: {
              userId: user.id,
              plan: 'FREE',
              planStatus: 'ACTIVE',
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          });
        }

        return (await tx.user.findUnique({
          where: { id: user.id },
          include: { profile: true, subscription: true },
        })) as UserWithRelations;
      });
    } catch (error) {
      console.error('Failed in create operations:', error);
      throw new InternalServerErrorException('An unexpected error occurred during user raw creation');
    }
  }

  async findOneByEmail(email: string): Promise<UserWithRelations | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error(`Failed to find user by email ${email}:`, error);
      throw new InternalServerErrorException('Error searching for user by email');
    }
  }

  async findOneByProvider(provider: string, providerId: string): Promise<UserWithRelations | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { provider, providerId },
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error(`Failed to find user by provider ${provider}:`, error);
      throw new InternalServerErrorException('Error searching for user by provider');
    }
  }

  async findOneById(id: string): Promise<UserWithRelations | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error(`Failed to find user by id ${id}:`, error);
      throw new InternalServerErrorException('Error searching for user by id');
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<UserWithRelations> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error(`Failed to update user with id ${id}:`, error);
      throw new InternalServerErrorException('An unexpected error occurred while updating the user');
    }
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.password) {
      throw new BadRequestException('Local authentication password is not set for this account');
    }

    const isMatch = await verify(user.password, dto.currentPassword);
    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await hash(dto.newPassword);

    try {
      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      console.error(`Failed to update password for user ${id}:`, error);
      throw new InternalServerErrorException('Error updating account password');
    }
  }

  async update2fa(id: string, dto: Toggle2faDto): Promise<UserWithRelations> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: { isTwoFactorEnabled: dto.user2fa },
        include: { profile: true, subscription: true },
      });
    } catch (error) {
      console.error(`Failed to update 2FA status for user ${id}:`, error);
      throw new InternalServerErrorException('Error updating 2FA settings');
    }
  }
}