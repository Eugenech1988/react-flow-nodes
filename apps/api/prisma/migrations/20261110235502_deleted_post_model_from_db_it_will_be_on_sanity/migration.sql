/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "posts_translations" DROP CONSTRAINT "posts_translations_post_id_fkey";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "posts_translations";
