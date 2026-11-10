import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { ApplicationsService } from './applications.service';
import { jobApplicationInputSchema } from '@pipeline/contracts';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetterFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const jobId = req.body.jobId || 'unknown';
            const type = file.fieldname === 'resume' ? 'cvs' : 'covers';
            const path = `./uploads/applications/${jobId}/${type}`;

            try {
              mkdirSync(path, { recursive: true });
              cb(null, path);
            } catch (error) {
              cb(error as Error, path);
            }
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async create(
    @Body() body: unknown,
    @UploadedFiles()
    files: { resume?: Express.Multer.File[]; coverLetterFile?: Express.Multer.File[] },
  ) {
    const parsed = jobApplicationInputSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    if (!files.resume || files.resume.length === 0) {
      throw new BadRequestException('Resume is required');
    }

    const baseUrl = process.env.API_URL || 'http://localhost:3000';
    const jobId = parsed.data.jobId;

    return this.applicationsService.create({
      ...parsed.data,
      resumeUrl: `${baseUrl}/uploads/applications/${jobId}/cvs/${files.resume[0].filename}`,
      coverLetterUrl: files.coverLetterFile?.[0]
        ? `${baseUrl}/uploads/applications/${jobId}/covers/${files.coverLetterFile[0].filename}`
        : undefined,
    });
  }
}
