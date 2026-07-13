import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new InternalServerErrorException('An unexpected error occurred while fetching users');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    try {
      const hashedPassword = await hash(password);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...result } = user;
      return result;

    } catch (error) {
      console.error('Failed to create user:', error);
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
  }

  async findOneByEmail(email: string) {
    if (!email) {
      throw new ConflictException('A user with this email does not exists');
    }
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findOneById(id: string) {
    if (!id) {
      throw new ConflictException('A user with this id does not exist');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    return user;
  }
}