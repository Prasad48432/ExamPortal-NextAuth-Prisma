-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalAccuracy" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "RandomTable" (
    "id" TEXT NOT NULL,
    "titles" TEXT NOT NULL,
    "fuckings" TEXT NOT NULL,

    CONSTRAINT "RandomTable_pkey" PRIMARY KEY ("id")
);
