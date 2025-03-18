-- CreateTable
CREATE TABLE "SavedExam" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "SavedExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkedQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "BookmarkedQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedExam" ADD CONSTRAINT "SavedExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedExam" ADD CONSTRAINT "SavedExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedQuestion" ADD CONSTRAINT "BookmarkedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
