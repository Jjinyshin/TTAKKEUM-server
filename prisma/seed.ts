import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      nickname: 'User One',
      password: 'securepassword',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      nickname: 'User Two',
      password: 'securepassword',
    },
  });

  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        'Support for MongoDB has been one of the most requested features since the initial release of...',
      imageUrl: null,
      hashtag: { set: ['prisma', 'mongodb'] }, // Json field as an array
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user1.id, // reference to user1
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Our engineers have been working hard, issuing new releases with many improvements...',
      imageUrl: 'https://example.com/image.png',
      hashtag: { set: ['prisma', 'update', 'q1'] }, // Json field as an array
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user2.id, // reference to user2
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
