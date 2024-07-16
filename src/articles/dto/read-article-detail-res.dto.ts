import { ApiProperty } from '@nestjs/swagger';
import { ArticleEntity } from '../entities/article.entity';

export class ReadArticleResponseDto extends ArticleEntity {
  constructor(articleDetail: Partial<ArticleEntity>, isLike: boolean) {
    super(articleDetail);
    this.isLike = isLike;
  }

  @ApiProperty({ description: '게시글 좋아요 여부' })
  isLike: boolean;
}
