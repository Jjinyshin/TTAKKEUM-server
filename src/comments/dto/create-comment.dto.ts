import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
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
  @IsOptional()
  userId?: number;
}
