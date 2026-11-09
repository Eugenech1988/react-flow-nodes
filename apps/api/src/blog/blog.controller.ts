import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.blogService.findAll({ locale });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.blogService.findOneBySlug(slug, locale);
  }
}
