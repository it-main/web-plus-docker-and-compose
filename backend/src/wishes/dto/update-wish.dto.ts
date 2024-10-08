import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  link: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  @Length(1, 1024)
  description: string;
}
