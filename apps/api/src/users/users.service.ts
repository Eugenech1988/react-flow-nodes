import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new InternalServerErrorException('An unexpected error occurred while fetching users');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, avatarUrl, provider, providerId } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    try {
      const hashedPassword = password ? await hash(password) : '';

      let nickName = createUserDto.nickName;
      if (!nickName) {
        nickName = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);
      }

      const existingNick = await this.prisma.user.findUnique({ where: { nickName } });
      if (existingNick) {
        nickName = `${nickName}_${Math.random().toString(36).substring(2, 5)}`;
      }

      const finalProvider = provider || 'local';
      const finalProviderId = providerId || email;

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          nickName,
          firstName: firstName || '',
          lastName: lastName || null,
          avatarUrl: avatarUrl || null,
          provider: finalProvider,
          providerId: finalProviderId,
        } as Prisma.UserCreateInput,
      });

      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    if (!email) throw new ConflictException('Email parameters are missing');
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    if (!id) throw new ConflictException('ID parameter is missing');
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        provider,
        providerId
      } as Prisma.UserWhereInput
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}