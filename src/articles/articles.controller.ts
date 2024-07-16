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
  Headers,
  UnauthorizedException,
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
import { DochiofTheWeekDto } from 'src/users/dto/read-dochi-of-the-week.dto';
import { UpdateArticleRequestDto } from './dto/update-article-req.dto';
import { LikeEntity } from './entities/like.entity';
import * as jwt from 'jsonwebtoken';

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
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => {
      const entity = new ArticleEntity(article);
      if (entity.image) {
        entity.image = `${process.env.BASE_URL}${entity.image}`;
      }
      return entity;
    });
  }

  @Get('dochi-of-the-week')
  @ApiOkResponse({ type: DochiofTheWeekDto, isArray: true })
  async getDochiofTheWeek() {
    return await this.articlesService.getTopArticlesAuthors();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization token found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUserId = decoded.userId;

      const article = await this.articlesService.findOne(id, currentUserId);
      return article;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOkResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateArticleRequestDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    let hashtags: string[] = [];
    if (body.hashtag) {
      hashtags = body.hashtag.split(',').map((tag) => tag.trim());
    }

    const updateArticleDto = new UpdateArticleDto();
    updateArticleDto.title = body.title;
    updateArticleDto.content = body.content;
    updateArticleDto.image = body.image;
    updateArticleDto.hashtag = hashtags;
    updateArticleDto.authorId = user.id;

    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto, image),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity })
  async likeArticle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.addLike(id, user.id);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: LikeEntity })
  async unlikeArticle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.removeLike(id, user.id);
  }
}
