import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create dummy users
  const passwordJin = await bcrypt.hash('password-jin', roundsOfHashing);
  const passwordYoung = await bcrypt.hash('password-young', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'Jin@example.com' },
    update: {
      password: passwordJin,
    },
    create: {
      email: 'Jin@example.com',
      nickname: 'User One',
      password: passwordJin,
      dochiname: '고슴이',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'Young@example.com' },
    update: {
      password: passwordYoung,
    },
    create: {
      email: 'Young@example.com',
      nickname: 'User Two',
      password: passwordYoung,
      dochiname: '도치',
    },
  });

  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { id: 1 }, // id로만 조건 설정
    update: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        'Support for MongoDB has been one of the most requested features since the initial release of...',
      image: null,
      hashtag: ['prisma', 'mongodb'], // set 대신 단순 배열 사용
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        'Support for MongoDB has been one of the most requested features since the initial release of...',
      image: null,
      hashtag: ['prisma', 'mongodb'], // set 대신 단순 배열 사용
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { id: 2 }, // id로만 조건 설정
    update: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Our engineers have been working hard, issuing new releases with many improvements...',
      image: 'https://example.com/image.png',
      hashtag: ['prisma', 'update', 'q1'], // set 대신 단순 배열 사용
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Our engineers have been working hard, issuing new releases with many improvements...',
      image: 'https://example.com/image.png',
      hashtag: ['prisma', 'update', 'q1'], // set 대신 단순 배열 사용
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user2.id,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
