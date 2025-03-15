"use server";

import db from "@/lib/db/db";

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
