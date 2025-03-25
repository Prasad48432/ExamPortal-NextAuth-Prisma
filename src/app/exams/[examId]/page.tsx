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
import {
  BookCheck,
  FileWarning,
  IdCard,
  TicketX,
  UserRoundX,
} from "lucide-react";

type Params = Promise<{ examId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const params = await props.params;
  const searchParams = await props.searchParams;

  const examId = params.examId;
  const attemptId = searchParams.attemptId;

  if (!attemptId) {
    return (
      <div className="h-screen w-full">
        <div className="flex flex-col items-center justify-center gap-4 max-w-xl h-full mx-auto text-foreground/70">
          <IdCard size={80} />
          <p className="text-xl font-semibold">Attempt ID Not Found</p>
          <p className="text-center w-[70%] lg:w-full text-sm lg:text-base">
            Please provide Attempt ID along with provided Exam Id and try again
            find info at{" "}
            <a
              href="/exams"
              className="underline text-primary/80 underline-offset-1"
            >
              /exams
            </a>
          </p>
        </div>
      </div>
    );
  }

  const exam = await getExamDetails(examId);

  if (!exam || !exam.data) {
    return (
      <div className="h-screen w-full">
        <div className="flex flex-col items-center justify-center gap-4 max-w-xl h-full mx-auto text-foreground/70">
          <FileWarning size={80} />
          <p className="text-xl font-semibold">Exam Not Found</p>
          <p className="text-center w-[70%] lg:w-full text-sm lg:text-base">
            We couldn't find an exam with the provided ID. Please double-check
            and try again. find exams at{" "}
            <a
              href="/exams"
              className="underline text-primary/80 underline-offset-1"
            >
              /exams
            </a>
          </p>
        </div>
      </div>
    );
  }

  const attempt = await getAttemptDetails(attemptId as string);

  if (!attempt || !attempt.data) {
    return (
      <div className="h-screen w-full">
        <div className="flex flex-col items-center justify-center gap-4 max-w-xl h-full mx-auto text-foreground/70">
          <TicketX size={80} />
          <p className="text-xl font-semibold">Invalid Attempt Id</p>
          <p className="text-center w-[70%] lg:w-full text-sm lg:text-base">
            There is something wrong with the attempt id provided. please
            double-check the id and try again. find exams at{" "}
            <a
              href="/exams"
              className="underline text-primary/80 underline-offset-1"
            >
              /exams
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (attempt.data.userId !== session.user?.id) {
    return (
      <div className="h-screen w-full">
        <div className="flex flex-col items-center justify-center gap-4 max-w-xl h-full mx-auto text-foreground/70">
          <UserRoundX size={80} />
          <p className="text-xl font-semibold">Invalid User</p>
          <p className="text-center w-[70%] lg:w-full text-sm lg:text-base">
            There is something wrong with the current user please find help at
            contact ceneter . find help at{" "}
            <a
              href="/contact"
              className="underline text-primary/80 underline-offset-1"
            >
              /contact
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (attempt.data.status === "completed") {
    return (
      <div className="h-screen w-full">
        <div className="flex flex-col items-center justify-center gap-4 max-w-xl h-full mx-auto text-foreground/70">
          <BookCheck className="text-chart-success/70" size={80} />
          <p className="text-xl font-semibold">Exam already completed</p>
          <p className="text-center w-[70%] lg:w-full text-sm lg:text-base">
            You have already completed this exam. Review your results or contact
            support if needed. find result at{" "}
            <a
              href={`/dashboard/results/${attemptId}`}
              className="underline text-primary/80 underline-offset-1"
            >
              /result
            </a>
          </p>
        </div>
      </div>
    );
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
      examId: attempt.data.examId,
    },
  });

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
