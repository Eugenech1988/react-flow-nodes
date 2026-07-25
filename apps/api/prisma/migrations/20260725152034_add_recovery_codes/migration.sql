-- AlterTable
ALTER TABLE "users" ADD COLUMN     "recover_codes" TEXT[] DEFAULT ARRAY[]::TEXT[];
