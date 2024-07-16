import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';
import { LikeEntity } from './entities/like.entity';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { DochiofTheWeekDto } from 'src/users/dto/read-dochi-of-the-week.dto';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { ReadArticleResponseDto } from './dto/read-article-detail-res.dto';

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
      include: { author: true, comments: { include: { user: true } } },
    });

    return articles.map(
      (article) =>
        new ArticleEntity({
          ...article,
          hashtag: article.hashtag as string[],
          comments: article.comments.map(
            (comment) => new CommentEntity(comment),
          ),
        }),
    );
  }

  async findOne(id: number, currentUserId): Promise<ArticleEntity> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    const isLike = article.likes.some((like) => like.userId === currentUserId);
    const { likes, ...articleWithoutLikes } = article;

    const articleDetail = new ReadArticleResponseDto(
      new ArticleEntity({
        ...articleWithoutLikes,
        hashtag: article.hashtag as string[],
        comments: article.comments.map((comment) => new CommentEntity(comment)),
      }),
      isLike,
    );
    if (articleDetail.image) {
      articleDetail.image = `${process.env.BASE_URL}${articleDetail.image}`;
    }

    return articleDetail;
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
    // 관련된 댓글 삭제
    await this.prisma.comment.deleteMany({
      where: { articleId: id },
    });

    const article = await this.prisma.article.delete({
      where: { id },
      include: { author: true },
    });

    return new ArticleEntity({
      ...article,
      hashtag: article.hashtag as string[],
    });
  }

  async addLike(articleId: number, userId: number): Promise<LikeEntity> {
    const like = await this.prisma.like.create({
      data: {
        articleId,
        userId,
      },
    });

    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return new LikeEntity(like);
  }

  async removeLike(articleId: number, userId: number): Promise<LikeEntity> {
    const like = await this.prisma.like.delete({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });

    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    return new LikeEntity(like);
  }

  async getTopArticlesAuthors(): Promise<DochiofTheWeekDto[]> {
    const topArticles = await this.prisma.article.findMany({
      orderBy: {
        likeCount: 'desc',
      },
      take: 3,
      include: {
        author: true,
        likes: true,
      },
    });

    const topAuthors = topArticles.map(
      (article) =>
        new DochiofTheWeekDto(
          article.author,
          article.likes.length,
          article.image,
        ),
    );

    return topAuthors;
  }
}
