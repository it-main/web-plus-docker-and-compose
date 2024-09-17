import { IsString, Length } from 'class-validator';

export class SigninDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(3)
  password: string;
}

export class SigninResponseDto {
  @IsString()
  access_token: string;
}
