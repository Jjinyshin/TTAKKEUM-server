import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class LikeArticleDto {
  @ApiProperty({ description: '좋아요 여부', example: true })
  @IsBoolean()
  like: boolean;
}
