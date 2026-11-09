import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { TUserSafe } from '@/auth/types/auth.types';
import { JobsService } from './jobs.service';
import type {
  TCreateJobInputData,
  TUpdateJobInputData,
  TUpsertJobTranslationInputData,
} from '@pipeline/contracts';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  create(@Body() dto: TCreateJobInputData, @CurrentUser() user: TUserSafe) {
    return this.jobsService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TUpdateJobInputData) {
    return this.jobsService.update(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.jobsService.publish(id);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.jobsService.archive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Put(':id/translations/:locale')
  upsertTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body() dto: TUpsertJobTranslationInputData,
  ) {
    return this.jobsService.upsertTranslation(id, { ...dto, locale });
  }

  @Delete(':id/translations/:locale')
  removeTranslation(@Param('id') id: string, @Param('locale') locale: string) {
    return this.jobsService.removeTranslation(id, locale);
  }
}
