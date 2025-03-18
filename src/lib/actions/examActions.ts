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


export async function getAttemptDetails(attemptId: string){
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



export async function submitExamResult(attemptId: string, score: number, formattedAnswers: JsonValue, passingScore: number){
  try {
    await db.examResult.update({
      where: { id: attemptId },
      data: {
        score: score,
        answers: formattedAnswers as any,
        completedAt: new Date().toISOString(),
        status: "completed",
        examPassed: score >= passingScore,
      },
    });

    return { success: true, attemptId};
  } catch (error) {
    return { success: false };
  }
}
