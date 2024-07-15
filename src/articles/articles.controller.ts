import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleRequestDto } from './dto/create-article-req.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(
    @Body() body: CreateArticleRequestDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<ArticleEntity> {
    // 해시태그 변환 로직 추가
    let hashtags: string[] = [];
    if (body.hashtag) {
      hashtags = body.hashtag.split(',').map((tag) => tag.trim());
    }

    // CreateArticleDto로 변환
    const createArticleDto = new CreateArticleDto();
    createArticleDto.title = body.title;
    createArticleDto.content = body.content;
    createArticleDto.image = body.image;
    createArticleDto.hashtag = hashtags;
    createArticleDto.authorId = user.id;

    return new ArticleEntity(
      await this.articlesService.create(createArticleDto, image),
    );
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.findOne(id));
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOkResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto, image),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
