/*
  Warnings:

  - Made the column `score` on table `ExamResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ExamResult" ALTER COLUMN "score" SET NOT NULL;
