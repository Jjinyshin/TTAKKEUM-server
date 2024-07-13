import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({ description: '게시글 내용' })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    description: '이미지 URL',
  })
  imageUrl?: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    description: '해시태그',
  })
  hashtag?: string[];

  // TODO: change to Token
  @IsNumber()
  @ApiProperty({ description: '작성자 ID' })
  authorId: number;
}
