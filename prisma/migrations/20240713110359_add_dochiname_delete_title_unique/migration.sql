/*
  Warnings:

  - Added the required column `dochiname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Article_title_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dochiname" TEXT NOT NULL;
