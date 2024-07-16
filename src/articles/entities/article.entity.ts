import { Article } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { LikeEntity } from './like.entity';

export class ArticleEntity implements Article {
  constructor(data: Partial<ArticleEntity>) {
    Object.assign(this, data);
    if (data.author) {
      this.author = new UserEntity(data.author);
    }
    if (data.likes) {
      this.likes = data.likes.map((like) => new LikeEntity(like));
    }
    if (data.comments) {
      this.comments = data.comments.map(
        (comment) => new CommentEntity(comment),
      );
    }
  }

  @ApiProperty({ description: '게시글 id' })
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  content: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '이미지 URL',
  })
  image: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '해시태그',
  })
  hashtag: string[];

  @ApiProperty({ description: '좋아요 수' })
  likeCount: number;

  @ApiProperty({ description: '게시글 작성시각' })
  createdAt: Date;

  @ApiProperty({ description: '게시글 마지막 수정시각' })
  updatedAt: Date;

  @ApiProperty({ description: '작성자 ID' })
  authorId: number;

  @ApiProperty({ description: '작성자 정보', type: () => UserEntity })
  author: UserEntity;

  @ApiProperty({ description: '댓글들', type: () => [CommentEntity] })
  comments: CommentEntity[];

  @ApiProperty({ description: '좋아요들', type: () => [CommentEntity] })
  likes: LikeEntity[];
}
