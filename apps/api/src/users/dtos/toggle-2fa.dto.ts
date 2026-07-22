import { IsBoolean } from 'class-validator';

export class Toggle2faDto {
  @IsBoolean()
  user2fa: boolean;
}