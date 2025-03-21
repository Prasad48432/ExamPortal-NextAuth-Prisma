"use server";

import db from "@/lib/db/db";
import type { JsonValue } from "@prisma/client/runtime/library";

export async function getRandomQuestions(examId: string, count: number) {
  try {
    const questions = await db.$queryRaw`
        SELECT * FROM "Question"
        WHERE "examId" = ${examId}
        ORDER BY RANDOM()
        LIMIT ${count}
      `;

    return { success: true, data: questions };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching random questions",
      error,
    };
  }
}

export async function getExamDetails(examId: string) {
  try {
    const exam = await db.exam.findUnique({
      where: {
        id: examId,
      },
    });

    return { success: true, data: exam };
  } catch (error) {
    return { success: false, message: "Error fetching exam details", error };
  }
}

export async function getAttemptDetails(attemptId: string) {
  try {
    const attempt = await db.examResult.findUnique({
      where: {
        id: attemptId,
      },
    });

    return { success: true, data: attempt };
  } catch (error) {
    return { success: false, message: "Error fetching attempt details", error };
  }
}

export async function validateSecurityCheck(attemptId: string) {
  try {
    const updatedAttempt = await db.examResult.update({
      where: { id: attemptId },
      data: {
        securityCheck: true,
        startedAt: new Date().toISOString(),
      },
      select: {
        id: true,
        securityCheck: true,
        startedAt: true, // Select other required fields
      },
    });

    return { success: true, attempt: updatedAttempt };
  } catch (error) {
    return { success: false, error: error };
  }
}

export async function submitExamResult(
  attemptId: string,
  score: number,
  formattedAnswers: JsonValue,
  passingScore: number,
  timeDifferenceInSeconds: number,
  userId: string,
  attemptedQuestions: number,
  correctAnswers: number,
  wrongAnswers: number,
  unanswered: number
) {
  try {
    await db.$transaction(async (tx) => {
      // Update examResult
      await tx.examResult.update({
        where: { id: attemptId },
        data: {
          score: score,
          answers: formattedAnswers as any,
          completedAt: new Date().toISOString(),
          status: "completed",
          totalQuestionsAttempted: attemptedQuestions,
          totalCorrect: correctAnswers,
          totalWrong: wrongAnswers,
          totalUnanswered: unanswered,
          examPassed: score >= passingScore,
          timeSpent: timeDifferenceInSeconds,
        },
      });

      // Update User table (assuming we are updating total exams taken, total time spent, etc.)
      await tx.user.update({
        where: { id: userId },
        data: {
          totalExamsTaken: { increment: 1 },
          totalQuestionsAttempted: { increment: attemptedQuestions },
          totalCorrect: { increment: correctAnswers },
          totalWrong: { increment: wrongAnswers },
          totalUnanswered: { increment: unanswered },
          totalTimeSpent: { increment: timeDifferenceInSeconds },
          totalAccuracy: {
            increment: (correctAnswers / attemptedQuestions) * 100,
          },
        },
      });
    });

    return { success: true, attemptId };
  } catch (error) {
    return { success: false };
  }
}

export async function saveExam(userId: string, examId: string, action: string) {
  try {
    if (action === "add") {
      await db.savedExam.create({
        data: {
          userId: userId,
          examId: examId,
        },
      });
    } else if (action == "delete") {
      await db.savedExam.deleteMany({
        where: {
          userId: userId,
          examId: examId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function saveQuestion(
  userId: string,
  questionId: string,
  examId: string,
  action: string
) {
  try {
    if (action === "add") {
      await db.bookmarkedQuestion.create({
        data: {
          userId: userId,
          questionId: questionId,
          examId: examId,
        },
      });
    } else if (action == "delete") {
      await db.bookmarkedQuestion.deleteMany({
        where: {
          userId: userId,
          questionId: questionId,
          examId: examId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
