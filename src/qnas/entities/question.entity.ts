import { Question as PrismaQuestion } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnswerEntity } from 'src/qnas/entities/answer.entity';

export class QuestionEntity implements PrismaQuestion {
  constructor(partial: Partial<QuestionEntity>) {
    Object.assign(this, partial);
  }
  updatedAt: Date;

  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ type: () => UserEntity })
  author: UserEntity;

  @ApiProperty({ type: () => [AnswerEntity] })
  answers: AnswerEntity[];
}
