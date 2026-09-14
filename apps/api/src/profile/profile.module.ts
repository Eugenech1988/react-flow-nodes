import { Module } from '@nestjs/common';
import { ProfileService } from '@/profile/profile.service';
import { ProfileController } from '@/profile/profile.controller';
import { UsersService } from '@/users/users.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UsersService],
})
export class ProfileModule {}