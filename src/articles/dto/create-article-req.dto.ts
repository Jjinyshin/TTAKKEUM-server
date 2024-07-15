import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateArticleRequestDto {
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

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '이미지 파일',
    required: false,
  })
  image?: Express.Multer.File;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    description: '해시태그 (쉼표로 구분된 문자열)',
  })
  hashtag?: string;
}
