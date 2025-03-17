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

export default async function Page({
  params,
}: {
  params: { resultId: string };
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { resultId } = await params;

  const result = await db.examResult.findUnique({
    where: {
      id: resultId,
    },
    include: {
      exam: true,
    },
  });

  if (!result?.examId || !Array.isArray(result.answers)) return;

  const questions = await getQuestionsbyExamId(result.examId);

  const answersArray = result.answers as Answer[];

  const answersMap = answersArray.reduce((acc, answer) => {
    acc[answer?.question_id] = answer;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-12 w-full">
          <ResultSection
            result={result}
            gotQuestions={questions.data as Question[]}
            answersMap={answersMap}
          />
        </div>
      </div>
    </div>
  );
}
