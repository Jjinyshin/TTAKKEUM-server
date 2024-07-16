import { Like } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { ArticleEntity } from 'src/articles/entities/article.entity';

export class LikeEntity implements Like {
  constructor(data: Partial<LikeEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty({ description: '좋아요 id' })
  id: number;

  @ApiProperty({ description: '좋아요한 시각' })
  createdAt: Date;

  @ApiProperty({ description: '게시글 ID' })
  articleId: number;

  @ApiProperty({ description: '사용자 ID' })
  userId: number;

  @ApiProperty({ description: '게시글', type: () => ArticleEntity })
  article: ArticleEntity;

  @ApiProperty({ description: '사용자', type: () => UserEntity })
  user: UserEntity;
}
