import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(3)
  password: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
