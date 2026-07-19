import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Укажите ваш Guard доступа
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // Ваш декоратор получения юзера из req.user

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar')) // Ключ 'avatar' совпадает с FormData на фронтенде
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedUser = await this.profileService.update(userId, updateProfileDto, file);

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }
}