import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { QnasService } from './qnas.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('questions')
@ApiTags('questions')
export class QnasController {
  constructor(private readonly questionsService: QnasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.create(createQuestionDto, user.id);
  }

  // TODO: 답변까지 리턴하기
  @Get()
  async findAll() {
    return this.questionsService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.remove(id);
  }

  @Post(':questionId/answers')
  async createAnswer(@Body() createAnswerDto: CreateAnswerDto) {
    return this.questionsService.createAnswer(createAnswerDto);
  }

  @Delete(':questionId/answers/:answerId')
  async removeAnswer(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('answerId', ParseIntPipe) answerId: number,
  ) {
    return this.questionsService.removeAnswer(answerId);
  }
}
