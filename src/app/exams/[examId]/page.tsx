import {
  getAttemptDetails,
  getExamDetails,
  getRandomQuestions,
} from "@/lib/actions/examActions";
import ExamSection from "./components/examSection";
import { Exam, ExamResult, Question } from "@prisma/client";

export default async function Page({
  params,
  searchParams,
}: {
  params: { examId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams?.attemptId) {
    return <div>Invalid Attempt</div>;
  }


  const attempt = await getAttemptDetails(searchParams?.attemptId as string);
  const questions = await getRandomQuestions(params.examId, 10);
  const exam = await getExamDetails(params.examId);

  return (
    <div>
      <ExamSection
        lockQuestions={questions.data as Question[]}
        examDetails={exam.data as Exam}
        attempt={attempt.data as ExamResult}
      />
    </div>
  );
}
