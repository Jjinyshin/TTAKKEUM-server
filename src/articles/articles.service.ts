import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const { authorId, ...articleData } = createArticleDto;

    const article = await this.prisma.article.create({
      data: {
        ...articleData,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: false },
    });

    // Convert JsonValue to string[]
    const articleEntity = new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[], // Explicitly cast JsonValue to string[]
    });

    return articleEntity;
  }

  async findAll(): Promise<ArticleEntity[]> {
    const articles = await this.prisma.article.findMany({
      include: { author: true },
    });

    return articles.map(
      (article) =>
        new ArticleEntity({
          ...article,
          hashtag: article.hashtag as string[],
        }),
    );
  }

  async findOne(id: number): Promise<ArticleEntity> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[], // Explicitly cast JsonValue to string[]
    });
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const { authorId, ...articleData } = updateArticleDto;

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true }, // Include author data if needed
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[], // Explicitly cast JsonValue to string[]
    });
  }

  async remove(id: number): Promise<ArticleEntity> {
    const article = await this.prisma.article.delete({
      where: { id },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[], // Explicitly cast JsonValue to string[]
    });
  }
}
