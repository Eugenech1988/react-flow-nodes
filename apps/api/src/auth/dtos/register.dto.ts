import { IsNotEmpty, IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
