import db from "@/lib/db/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQuestionsbyExamId } from "@/lib/actions/resultAction";
import ResultSection from "../components/resultsection";
import { Question } from "@prisma/client";

type Answer = {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
};

type Params = Promise<{ resultId: string }>;

export default async function Page(props: { params: Params }) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const params = await props.params;
  const resultId = params.resultId;


  const result = await db.examResult.findUnique({
    where: {
      id: resultId,
    },
    include: {
      exam: true,
    },
  });

  const userWithResults = await db.user.findUnique({
    where: {
      id: session.user?.id
    },
    include: {
      exams: true,
    }
  })

  if (!result?.examId || !Array.isArray(result.answers)) return;

  const questions = await getQuestionsbyExamId(result.examId);

  const answersArray = result.answers as Answer[];

  const answersMap = answersArray.reduce((acc, answer) => {
    acc[answer?.question_id] = answer;
    return acc;
  }, {} as Record<string, any>);

  if (!userWithResults) return;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <ResultSection
        result={result}
        gotQuestions={questions.data as Question[]}
        answersMap={answersMap}
        userWithResults={userWithResults}
      />
    </div>
  );
}
