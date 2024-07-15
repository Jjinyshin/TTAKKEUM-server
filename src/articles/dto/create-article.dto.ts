import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsOptional()
  image?: Express.Multer.File;

  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  hashtag?: string[];

  @Type(() => Number)
  @IsNumber()
  authorId: number;
}
