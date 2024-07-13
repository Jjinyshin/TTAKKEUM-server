import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  content: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '이미지 URL',
  })
  imageUrl?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '해시태그',
  })
  hashtag?: any;

  // TODO: change to Token
  @ApiProperty({ description: '작성자 ID' })
  authorId: number;
}
