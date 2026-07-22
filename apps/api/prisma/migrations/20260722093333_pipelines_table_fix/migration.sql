/*
  Warnings:

  - Added the required column `lastRunAt` to the `pipelines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pipelines" ADD COLUMN     "lastRunAt" TIMESTAMP(3) NOT NULL;
