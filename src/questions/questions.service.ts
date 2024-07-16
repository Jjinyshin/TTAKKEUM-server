import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionEntity } from './entities/question.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnswerEntity } from 'src/answers/entities/answer.entity';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    authorId: number,
  ): Promise<QuestionEntity> {
    const question = await this.prisma.question.create({
      data: {
        ...createQuestionDto,
        authorId,
      },
      include: {
        author: true,
        answers: false,
      },
    });

    return new QuestionEntity({
      ...question,
      author: new UserEntity(question.author),
    });
  }

  findAll() {
    return `This action returns all questions`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
