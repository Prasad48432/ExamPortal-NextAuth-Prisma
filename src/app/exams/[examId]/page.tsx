import {
  getAttemptDetails,
  getExamDetails,
  getRandomQuestions,
} from "@/lib/actions/examActions";
import ExamSection from "./components/examSection";
import { Exam, ExamResult, Question } from "@prisma/client";
import db from "@/lib/db/db";

export default async function Page({
  params,
  searchParams,
}: {
  params: { examId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const { examId } = await params
  const resolvedSearchParams = await searchParams;
  const attemptId = resolvedSearchParams?.attemptId as string | undefined;


  if (!attemptId) {
    return <div>Invalid Attempt</div>;
  }

  const exam = await getExamDetails(examId);

  if(!exam || !exam.data){
    return <div>Invalid Exam</div>;
  }

  const attempt = await getAttemptDetails(attemptId);

  if(!attempt || !attempt.data){
    return <div>Attempt not found</div>;
  }

  const storedQuestions = attempt.data.questions;

  let questions: Question[] = [];
  
  // Ensure storedQuestions is a valid JSON array
  if (!storedQuestions || typeof storedQuestions !== "string" || storedQuestions.length === 0) {
    const getQuestions = await getRandomQuestions(examId, exam.data.totalQuestions);
    questions = getQuestions.data as Question[];
  
    await db.examResult.update({
      where: { id: attempt.data.id },
      data: {
        questions: JSON.stringify(questions), // Store as JSON string
      },
    });
  } else {
    questions = JSON.parse(storedQuestions) as Question[]; // Convert back to array
  }


  return (
    <div>
      <ExamSection
        lockQuestions={questions}
        examDetails={exam.data as Exam}
        attempt={attempt.data as ExamResult}
      />
    </div>
  );
}
