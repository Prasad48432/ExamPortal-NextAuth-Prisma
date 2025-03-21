-- AlterTable
ALTER TABLE "ExamResult" ADD COLUMN     "totalCorrect" INTEGER DEFAULT 0,
ADD COLUMN     "totalQuestionsAttempted" INTEGER DEFAULT 0,
ADD COLUMN     "totalUnanswered" INTEGER DEFAULT 0,
ADD COLUMN     "totalWrong" INTEGER DEFAULT 0;
