import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class Login2faDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Temporary token received from standard login when 2FA is enabled'
  })
  @IsString()
  @IsNotEmpty()
  tempToken: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit code from authenticator app'
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}