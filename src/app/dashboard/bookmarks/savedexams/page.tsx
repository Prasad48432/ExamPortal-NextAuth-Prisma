import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import React from "react";
import SavedExamList from "./components/savedExamList";

export default async function SavedExams() {
  const session = await auth();

  const savedExams = await db.savedExam.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      exam: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
        <SavedExamList exams={savedExams} userId={session?.user?.id || ""} />
    </div>
  );
}
