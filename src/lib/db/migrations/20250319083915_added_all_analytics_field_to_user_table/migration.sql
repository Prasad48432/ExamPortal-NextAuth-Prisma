/*
  Warnings:

  - You are about to drop the `RandomTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalCorrect" INTEGER DEFAULT 0,
ADD COLUMN     "totalExamsTaken" INTEGER DEFAULT 0,
ADD COLUMN     "totalQuestionsAttempted" INTEGER DEFAULT 0,
ADD COLUMN     "totalTimeSpent" INTEGER DEFAULT 0,
ADD COLUMN     "totalUnanswered" INTEGER DEFAULT 0,
ADD COLUMN     "totalWrong" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "RandomTable";
