import { PartialType } from '@nestjs/swagger';
import { CreateArticleRequestDto } from './create-article-req.dto';

export class UpdateArticleRequestDto extends PartialType(
  CreateArticleRequestDto,
) {}
