/*
  Warnings:

  - You are about to drop the `post_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_translations" DROP CONSTRAINT "post_translations_post_id_fkey";

-- DropTable
DROP TABLE "post_translations";

-- CreateTable
CREATE TABLE "posts_translations" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "posts_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_translations_post_id_locale_key" ON "posts_translations"("post_id", "locale");

-- AddForeignKey
ALTER TABLE "posts_translations" ADD CONSTRAINT "posts_translations_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
