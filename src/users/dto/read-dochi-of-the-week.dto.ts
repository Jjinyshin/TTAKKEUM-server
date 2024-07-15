import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class DochiofTheWeekDto extends UserEntity {
  constructor(user: Partial<UserEntity>, likes: number) {
    super(user);
    this.totalLikes = likes;
  }

  @ApiProperty({ description: '게시글의 총 좋아요 수' })
  totalLikes: number;
}
