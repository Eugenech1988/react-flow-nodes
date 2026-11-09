import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  UsersService,
  type SafeUserWithRelations,
  type UserWithRelations,
  type TCreateUserInputData,
} from '@/users/users.service';
import type { TUpdatePasswordInputData } from '@pipeline/contracts';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { type TUserSafe } from '@/users/types';
import type { Request } from 'express';

interface IRequestWithUser extends Request {
  user: TUserSafe;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: TCreateUserInputData): Promise<UserWithRelations> {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async findAll(): Promise<SafeUserWithRelations[]> {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @Req() req: IRequestWithUser,
    @Body() dto: TUpdatePasswordInputData,
  ): Promise<{ success: boolean }> {
    await this.usersService.updatePassword(req.user.id, dto);
    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@Req() req: IRequestWithUser): Promise<{ success: boolean }> {
    if (!req.user?.id) {
      throw new BadRequestException('User ID is missing from token session');
    }

    await this.usersService.delete(req.user.id);
    return { success: true };
  }
}
