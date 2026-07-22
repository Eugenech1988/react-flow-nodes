/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `pipelines` table. All the data in the column will be lost.
  - The `status` column on the `pipelines` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED');

-- AlterTable
ALTER TABLE "pipelines" DROP COLUMN "thumbnail",
DROP COLUMN "status",
ADD COLUMN     "status" "PipelineStatus" DEFAULT 'DRAFT';
