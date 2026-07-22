import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post('user/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/screenshots',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreatePipelineDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.pipelinesService.create(userId, dto, file);
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.pipelinesService.findAllByUserId(userId);
  }
}