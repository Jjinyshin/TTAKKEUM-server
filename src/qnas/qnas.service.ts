import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionEntity } from './entities/question.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class QnasService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(
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

  async findAllQnas() {
    return `This action returns all questions`;
  }

  async removeQuestion(id: number) {
    const question = await this.prisma.question.delete({
      where: { id },
      include: { author: false, answers: false },
    });
    return new QuestionEntity(question);
  }

  async createAnswer(createAnswerDto: CreateAnswerDto) {
    return 'This action adds a new answer';
  }

  async removeAnswer(id: number) {
    return `This action removes a #${id} answer`;
  }
}
