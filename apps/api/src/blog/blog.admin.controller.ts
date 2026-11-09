import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { TUserSafe } from '@/auth/types/auth.types';
import { BlogService } from './blog.service';
import type { TCreatePostInputData, TUpdatePostInputData } from '@pipeline/contracts';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
@Controller('admin/blog')
export class AdminBlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  create(@Body() dto: TCreatePostInputData, @CurrentUser() user: TUserSafe) {
    return this.blogService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TUpdatePostInputData) {
    return this.blogService.update(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.blogService.publish(id);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.blogService.archive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}