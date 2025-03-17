"use server";

import db from "@/lib/db/db";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { ToastError } from "@/components/toast";

export async function insertQuestion(formData: FormData) {
  try {
    const createdAt = new Date();
    const examId = formData.get("examId") as string;
    const questionText = formData.get("questionText") as string;
    const options = JSON.parse(formData.get("options") as string) as string[];
    const correctAnswer = Number(formData.get("correctAnswer"));
    const explanation = formData.get("explanation") as string;
    const reference = formData.get("reference") as string;

    await db.question.create({
      data: {
        createdAt,
        examId,
        questionText,
        options,
        correctAnswer,
        explanation,
        reference,
      },
    });

    return { success: true, message: "Question inserted successfully!" };
  } catch (error) {
    return { success: false, message: "Error inserting question", error };
  }
}

export async function startExam(userId: string, examId: string) {
    try {
      const newExamResult = await db.examResult.create({
        data: {
          userId,
          examId,
          createdAt: new Date(),
          score: 0,
          questions: Prisma.JsonNull,
          answers: Prisma.JsonNull,
          status: "ongoing",
          securityCheck: false,
          completedAt: null,
          startedAt: null,
        },
        select: { id: true },
      });
  
      return { success: true, examResult: newExamResult }; // Return the created result
    } catch (error) {
      return { success: false, message: "Error initializing exam result", error };
    }
  }