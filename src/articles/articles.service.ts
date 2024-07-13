import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    const { authorId, ...articleData } = createArticleDto;

    return this.prisma.article.create({
      data: {
        ...articleData,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });
  }

  findAll() {
    return this.prisma.article.findMany();
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    const { authorId, ...articleData } = updateArticleDto;

    return this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
