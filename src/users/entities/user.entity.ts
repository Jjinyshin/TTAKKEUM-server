import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ArticleEntity } from 'src/articles/entities/article.entity';

export class UserEntity implements User {
  @ApiProperty({ description: '사용자 id' })
  id: number;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '도치 이름' })
  dochiname: string;

  @ApiProperty({ description: '사용자 생성 시각' })
  createdAt: Date;

  @ApiProperty({ description: '사용자 수정 시각' })
  updatedAt: Date;

  @ApiProperty({
    description: '사용자의 게시물들',
    type: () => [ArticleEntity],
    required: false,
  })
  articles?: ArticleEntity[];

  password: string;
}
