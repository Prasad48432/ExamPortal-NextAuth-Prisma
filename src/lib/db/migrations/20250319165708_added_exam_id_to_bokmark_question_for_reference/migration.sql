/*
  Warnings:

  - You are about to drop the `RandomTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "BookmarkedQuestion" ADD COLUMN     "examId" TEXT NOT NULL DEFAULT 'exam';

-- DropTable
DROP TABLE "RandomTable";
