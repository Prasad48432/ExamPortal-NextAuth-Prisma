import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import React from "react";
import SavedQuestionList from "./components/savedQuestionList";

export default async function SavedQuestions() {
  const session = await auth();

  const savedQuestions = await db.bookmarkedQuestion.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      question: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SavedQuestionList
        questions={savedQuestions}
        userId={session?.user?.id || ""}
      />
    </div>
  );
}
