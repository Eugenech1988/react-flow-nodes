/*
  Warnings:

  - You are about to drop the column `lastRunAt` on the `pipelines` table. All the data in the column will be lost.
  - Added the required column `last_run_at` to the `pipelines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pipelines" DROP COLUMN "lastRunAt",
ADD COLUMN     "last_run_at" TIMESTAMP(3) NOT NULL;
