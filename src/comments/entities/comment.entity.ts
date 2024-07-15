import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { ArticleEntity } from 'src/articles/entities/article.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CommentEntity implements Comment {
  constructor(data: Partial<CommentEntity>) {
    Object.assign(this, data);
    if (data.user) {
      this.user = new UserEntity(data.user);
    }
    if (data.article) {
      this.article = new ArticleEntity(data.article);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  articleId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: () => ArticleEntity })
  article: ArticleEntity;

  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
}
