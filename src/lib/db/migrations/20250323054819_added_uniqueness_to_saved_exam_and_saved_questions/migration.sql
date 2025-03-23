/*
  Warnings:

  - A unique constraint covering the columns `[userId,questionId]` on the table `BookmarkedQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,examId]` on the table `SavedExam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "RandomTable" (
    "id" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,

    CONSTRAINT "RandomTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkedQuestion_userId_questionId_key" ON "BookmarkedQuestion"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedExam_userId_examId_key" ON "SavedExam"("userId", "examId");
