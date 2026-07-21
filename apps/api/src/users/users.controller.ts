import {
  Controller,
  Post,
  Get,
  Patch,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { type TUserSafe } from './types';
import type { Request } from 'express';

interface IRequestWithUser extends Request {
  user: TUserSafe;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePassword(
    @Req() req: IRequestWithUser,
    @Body() dto: UpdatePasswordDto,
  ): Promise<{ success: boolean }> {
    await this.usersService.updatePassword(req.user.id, dto);
    return { success: true };
  }
}