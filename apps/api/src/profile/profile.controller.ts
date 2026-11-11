import { Controller, Patch, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { updateProfileInputSchema, type TUpdateProfileInputData } from '@pipeline/contracts';
import { avatarDestination, avatarFilename } from './profile.helpers';

const avatarUploadOptions = {
  storage: diskStorage({
    destination: avatarDestination,
    filename: avatarFilename,
  }),
};

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', avatarUploadOptions))
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: TUpdateProfileInputData,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validatedData = updateProfileInputSchema.parse(body);

    const input: TUpdateProfileInputData = {
      ...validatedData,
      avatarUrl: file ? `/uploads/avatars/${file.filename}` : validatedData.avatarUrl,
    };

    const updatedUser = await this.profileService.update(userId, input);

    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }
}
