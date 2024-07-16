import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
