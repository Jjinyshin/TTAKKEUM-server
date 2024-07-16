import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('answers')
@ApiTags('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // TODO: 답변 달때 질문 id 받기
  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answersService.remove(+id);
  }
}
