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
    update: {},
    create: {
      title: '진영이가 남긴 첫번째 게시물이요',
      content: '으하하 어떤데',
      image: null,
      hashtag: ['신', '진'],
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { id: 2 }, // id로만 조건 설정
    update: {},
    create: {
      title: '진영이가 남긴 두번째 게시물이요',
      content: '어떠냐아앗',
      image: 'https://example.com/image.png',
      hashtag: ['진', '영', '신'], // set 대신 단순 배열 사용
      authorId: user2.id,
    },
  });
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
