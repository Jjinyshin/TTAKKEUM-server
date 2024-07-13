-- 새로운 열 추가
ALTER TABLE "Article" ADD COLUMN "content" TEXT;
ALTER TABLE "Article" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Article" ADD COLUMN "hashtag" TEXT;

-- 기존 데이터 이동 (예: body -> content)
UPDATE "Article" SET "content" = "body";

-- 기존 열 삭제
ALTER TABLE "Article" DROP COLUMN "body";
ALTER TABLE "Article" DROP COLUMN "description";
ALTER TABLE "Article" DROP COLUMN "published";

-- NOT NULL 제약 조건 추가
ALTER TABLE "Article" ALTER COLUMN "content" SET NOT NULL;
