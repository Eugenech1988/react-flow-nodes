import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll(
    @Query('locale') locale?: string,
    @Query('department') department?: string,
  ) {
    return this.jobsService.findAll({ locale, department });
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.jobsService.findOneBySlug(slug, locale);
  }
}