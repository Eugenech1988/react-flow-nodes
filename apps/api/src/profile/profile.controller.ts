import {
  Controller,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { updateProfileInputSchema, type TUpdateProfileInput } from '@pipeline/contracts';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads/avatars';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: TUpdateProfileInput,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedData = updateProfileInputSchema.parse(body);

    const input: TUpdateProfileInput = {
      ...validatedData,
      avatarUrl: file ? `/uploads/avatars/${file.filename}` : validatedData.avatarUrl,
    };

    const updatedUser = await this.profileService.update(userId, input);
    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }
}