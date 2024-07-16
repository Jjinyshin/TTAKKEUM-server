import { Answer as PrismaAnswer } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { QuestionEntity } from 'src/qnas/entities/question.entity';

export class AnswerEntity implements PrismaAnswer {
  constructor(partial: Partial<AnswerEntity>) {
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
  questionId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ type: () => UserEntity })
  author: UserEntity;

  @ApiProperty({ type: () => QuestionEntity })
  question: QuestionEntity;
}
