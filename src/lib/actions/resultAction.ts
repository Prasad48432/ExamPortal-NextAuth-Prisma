"use server";

import db from "@/lib/db/db";

export async function getQuestionsbyExamId(examId: string) {
  try {
    const questions = await db.question.findMany({
      where: {
        examId: examId,
      },
    });

    return { success: true, data: questions };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching random questions",
    };
  }
}
