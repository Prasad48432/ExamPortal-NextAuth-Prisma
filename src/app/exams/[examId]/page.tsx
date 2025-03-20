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



type Params = Promise<{ examId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const params = await props.params
  const searchParams = await props.searchParams


  const  examId  = params.examId;
  const attemptId = searchParams.attemptId;


  if (!attemptId) {
    return <div>Invalid Attempt</div>;
  }

  const exam = await getExamDetails(examId);

  if (!exam || !exam.data) {
    return <div>Invalid Exam</div>;
  }

  const attempt = await getAttemptDetails(attemptId as string);

  if (!attempt || !attempt.data) {
    return <div>Attempt not found</div>;
  }

  if(attempt.data.status === 'completed'){
    return <div>Exam already completed</div>
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

  const bookmarkedQuestions = await db.bookmarkedQuestion.findMany({
    where: {
      userId: attempt.data.userId,
      examId: attempt.data.examId
    }
  })

  return (
    <div>
      <ExamSection
        lockQuestions={questions}
        examDetails={exam.data as Exam}
        attempt={attempt.data as ExamResult}
        userEmail={session.user?.email || ""}
        bookmarkedQuestions={bookmarkedQuestions}
      />
    </div>
  );
}
