import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PipelinesService } from '@/pipelines/pipelines.service';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('pipelines')
@UseGuards(JwtAuthGuard)
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post()
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
    @CurrentUser('id') userId: string,
    @Body() dto: TCreatePipelineInputData,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.pipelinesService.create(userId, dto, file);
  }

  @Get()
  async findAllByUserId(@CurrentUser('id') userId: string) {
    return this.pipelinesService.findAllByUserId(userId);
  }

  @Patch(':id')
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
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: Omit<TUpdatePipelineInputData, 'id'>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.pipelinesService.update(id, userId, dto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.pipelinesService.remove(id, userId);
  }
}
