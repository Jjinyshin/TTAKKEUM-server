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
  constructor(private readonly qnasService: QnasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.qnasService.createQuestion(createQuestionDto, user.id);
  }

  // TODO: 답변까지 리턴하기
  @Get()
  async findAllQnas() {
    return this.qnasService.findAllQnas();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.qnasService.removeQuestion(id);
  }

  @Post(':questionId/answers')
  async createAnswer(@Body() createAnswerDto: CreateAnswerDto) {
    return this.qnasService.createAnswer(createAnswerDto);
  }

  @Delete(':questionId/answers/:answerId')
  async removeAnswer(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('answerId', ParseIntPipe) answerId: number,
  ) {
    return this.qnasService.removeAnswer(answerId);
  }
}
