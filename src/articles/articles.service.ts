import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { LikeArticleDto } from './dto/like-article.dto';
import { DochiofTheWeekDto } from 'src/users/dto/read-dochi-of-the-week.dto';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createArticleDto: CreateArticleDto,
    image?: Express.Multer.File,
  ): Promise<ArticleEntity> {
    const { authorId, hashtag, ...articleData } = createArticleDto;
    const hashtags = Array.isArray(hashtag) ? hashtag : [hashtag];

    let imageUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}-${image.originalname}`;
      const filePath = join(__dirname, '..', 'uploads', fileName);
      writeFileSync(filePath, image.buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const article = await this.prisma.article.create({
      data: {
        ...articleData,
        image: imageUrl,
        hashtag: hashtags || [],
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[],
    });
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
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[],
      comments: article.comments.map((comment) => new CommentEntity(comment)), // Explicitly map comments to CommentEntity
    });
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    image?: Express.Multer.File,
  ): Promise<ArticleEntity> {
    const { authorId, hashtag, ...articleData } = updateArticleDto;
    const hashtags = Array.isArray(hashtag) ? hashtag : [hashtag];

    let imageUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}-${image.originalname}`;
      const filePath = join(__dirname, '..', 'uploads', fileName);
      writeFileSync(filePath, image.buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        ...(imageUrl && { image: imageUrl }),
        hashtag: hashtags || [],
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[],
    });
  }

  async remove(id: number): Promise<ArticleEntity> {
    const article = await this.prisma.article.delete({
      where: { id },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[],
    });
  }

  // '좋아요' 여부에 따라 증가 또는 감소 메서드
  async like(
    id: number,
    likeArticleDto: LikeArticleDto,
  ): Promise<ArticleEntity> {
    const { like } = likeArticleDto;

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        likes: {
          increment: like ? 1 : -1,
        },
      },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[], // Explicitly cast JsonValue to string[]
    });
  }

  async getTopArticlesAuthors(): Promise<DochiofTheWeekDto[]> {
    const topArticles = await this.prisma.article.findMany({
      orderBy: {
        likes: 'desc',
      },
      take: 3,
      include: {
        author: true,
      },
    });

    const topAuthors = topArticles.map(
      (article) =>
        new DochiofTheWeekDto(article.author, article.likes, article.image),
    );
    return topAuthors;
  }
}
