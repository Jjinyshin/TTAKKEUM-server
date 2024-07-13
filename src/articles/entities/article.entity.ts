import { Article } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleEntity implements Article {
  @ApiProperty({ description: '게시글 고유값' })
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'The description of the article',
  })
  description: string;

  @ApiProperty({ description: '게시글 내용' })
  body: string;

  @ApiProperty({ description: 'Publication status of the article' })
  published: boolean;

  @ApiProperty({ description: '게시글 작성시각' })
  createdAt: Date;

  @ApiProperty({ description: '게시글 마지막 수정시각' })
  updatedAt: Date;
}
