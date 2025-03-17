import {
  getAttemptDetails,
  getExamDetails,
  getRandomQuestions,
} from "@/lib/actions/examActions";
import ExamSection from "./components/examSection";
import { Exam, ExamResult, Question } from "@prisma/client";
import db from "@/lib/db/db";
import { isJsonValueEmpty } from "./utils/isJsonEmpty";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: { examId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  const { examId } = await params;
  const resolvedSearchParams = await searchParams;
  const attemptId = resolvedSearchParams?.attemptId as string | undefined;

  if (!attemptId) {
    return <div>Invalid Attempt</div>;
  }

  const exam = await getExamDetails(examId);

  if (!exam || !exam.data) {
    return <div>Invalid Exam</div>;
  }

  const attempt = await getAttemptDetails(attemptId);

  if (!attempt || !attempt.data) {
    return <div>Attempt not found</div>;
  }

  let questions: Question[] = [];
  const storedQuestions = attempt.data.questions;

  if (isJsonValueEmpty(storedQuestions)) {
    const getQuestions = await getRandomQuestions(
      examId,
      exam.data.totalQuestions
    );
    questions = getQuestions.data as Question[];

    await db.examResult.update({
      where: { id: attempt.data.id },
      data: {
        questions: questions,
      },
    });
  } else {
    questions = storedQuestions as unknown as Question[];
  }

  return (
    <div>
      <ExamSection
        lockQuestions={questions}
        examDetails={exam.data as Exam}
        attempt={attempt.data as ExamResult}
        userEmail={session.user?.email || ""}
      />
    </div>
  );
}
