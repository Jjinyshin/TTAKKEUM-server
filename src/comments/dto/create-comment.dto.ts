import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  articleId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
