import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class DochiofTheWeekDto extends UserEntity {
  constructor(user: Partial<UserEntity>, likes: number, image: string) {
    super(user);
    this.totalLikes = likes;
    this.dochiArticleImage = `${process.env.BASE_URL}${image}`;
  }

  @ApiProperty({ description: '게시글의 총 좋아요 수' })
  totalLikes: number;

  @ApiProperty({ description: '도치 게시글의 사진' })
  dochiArticleImage: string;
}
