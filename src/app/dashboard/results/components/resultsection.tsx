"use client";
import {
  BookOpen,
  CheckCheck,
  CheckCircle,
  ChevronLeft,
  Clock,
  Info,
  Lightbulb,
  MessageSquareOff,
  SquareSlash,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import type { User, ExamResult, Exam, Question } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import ScoreBadge from "@/components/scorebadge";
import ExamStatusBadge from "@/components/statusbadge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTime } from "@/lib/utils/timeFomat";
import {
  getAccuracyColor,
  getExamFeedback,
  getFeedbackColor,
  getQuestionFeedback,
} from "../helpers/resultHelpers";
import { InfoPopover } from "./infoPopover";
import { formatDateTime } from "@/lib/utils/dateTimeFormat";

type ExamResultWithExam = ExamResult & { exam: Exam };

type UserwithResults = User & { exams: ExamResult[] };

const ResultSection = ({
  result,
  gotQuestions,
  answersMap,
  userWithResults,
}: {
  result: ExamResultWithExam;
  gotQuestions: Question[];
  answersMap: any;
  userWithResults: UserwithResults;
}) => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [filter, setFilter] = useState("all");

  const answersArray = (result.answers as any[]) ?? []; // Ensure it's an array

  let questions: Question[] = [];

  questions = answersArray
    .map((answer) => gotQuestions.find((q) => q.id === answer.question_id))
    .filter((q) => q !== undefined) as Question[];

  const filteredQuestions = questions.filter((question) => {
    const answer = answersMap[question.id];
    if (filter === "correct")
      return answer?.is_correct && answer?.selected_option !== -1;
    if (filter === "wrong")
      return !answer?.is_correct && answer?.selected_option !== -1;
    if (filter === "unanswered") return answer?.selected_option === -1;
    return true; // Show all by default
  });

  const examCorrect = Array.isArray(result.answers)
    ? (result.answers as any[]).filter((a) => a?.is_correct).length
    : 0;

  const examWrong = Array.isArray(result.answers)
    ? (result.answers as any[]).filter(
        (a) => !a?.is_correct && a?.selected_option !== -1
      ).length
    : 0;

  const examAttempted = examCorrect + examWrong;

  const examUnanswered = Array.isArray(result.answers)
    ? (result.answers as any[]).filter((a) => a?.selected_option === -1).length
    : 0;

  const totalTimeSpent = userWithResults.totalTimeSpent || 0;
  const totalExamsTaken = userWithResults.totalExamsTaken || 0;
  const totalQuestionsAttempted = userWithResults.totalQuestionsAttempted || 0;
  const totalCorrectAnswers = userWithResults.totalCorrect || 0;
  const totalWrongAnswers = userWithResults.totalWrong || 0;
  const totalUnanswered = userWithResults.totalUnanswered || 0;

  const examTimeSpent = result.timeSpent;
  const totalAverageTimeSpent = totalTimeSpent / totalExamsTaken;

  const examPerQuestionTimeSpent =
    examTimeSpent / (examAttempted + examUnanswered);
  const totalAverageTimeSpentperQuestion =
    totalTimeSpent / (totalQuestionsAttempted + totalUnanswered);

  const examAccuracy = ((examCorrect / examAttempted) * 100).toFixed(2);
  const totalAverageAccuracy = (
    (totalCorrectAnswers / totalQuestionsAttempted) *
    100
  ).toFixed(2);

  return (
    <div className="w-full">
      <div className="px-4 py-1 sm:px-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href="/dashboard/results"
            className="text-foreground/80 hover:text-foreground underline inline-flex items-center text-base mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to results
          </Link>
          <h2 className="text-xl font-bold leading-7 sm:text-2xl sm:truncate">
            {result.exam.title}
          </h2>
          <p className="">{result.exam.description}</p>
        </div>
      </div>

      <div className="w-full px-4 py-5 sm:px-6 flex flex-col lg:flex-row gap-4 items-center justify-center">
        <Card className="w-full lg:w-[40%] border bg-card text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg leading-none">
              Result Summary
            </CardTitle>
            <CardDescription className="leading-none">
              {" "}
              <p className="max-w-2xl text-xs lg:text-sm">
                Completed on:{" "}
                <span className="text-foreground/90 font-medium">
                  {result.completedAt
                    ? formatDateTime(result.completedAt)
                    : "Not completed"}
                </span>
              </p>
              <p className="mt-0.5 max-w-2xl text-xs lg:text-sm">
                Attempt id:{" "}
                <span className="text-foreground/80 font-medium">
                  {result.id}
                </span>
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-t  px-4 sm:p-0">
              <dl className="sm:divide-y">
                <div className="py-2 px-2 flex flex-row items-center justify-between sm:gap-4">
                  <dt className="text-sm lg:text-base font-semibold ">Score</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <ScoreBadge
                      score={result.score}
                      passed={result.examPassed}
                    />
                  </dd>
                </div>
                <div className="py-2 px-2 flex flex-row items-center justify-between sm:gap-4">
                  <dt className="text-sm lg:text-base font-semibold">Status</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <ExamStatusBadge passed={result.examPassed} />
                  </dd>
                </div>
                <div className="py-2 pl-2 pr-4 flex flex-row items-center justify-between sm:gap-4">
                  <dt className="text-sm lg:text-base font-semibold">Correct Answers</dt>
                  <dd className="mt-1 text-sm lg:text-base font-semibold text-green-500 sm:mt-0 sm:col-span-2">
                    {examCorrect}
                  </dd>
                </div>
                <div className="py-2 pl-2 pr-4 flex flex-row items-center justify-between sm:gap-4">
                  <dt className="text-sm lg:text-base font-semibold">Wrong Answers</dt>
                  <dd className="mt-1 text-sm lg:text-base font-semibold text-red-500 sm:mt-0 sm:col-span-2">
                    {examWrong}
                  </dd>
                </div>
                <div className="py-2 pl-2 pr-4 flex flex-row items-center justify-between sm:gap-4">
                  <dt className="text-sm lg:text-base font-semibold">Unanswered</dt>
                  <dd className="mt-1 text-sm lg:text-base font-medium text-yellow-500 sm:mt-0 sm:col-span-2">
                    {examUnanswered}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[60%] border bg-card text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg leading-none">
              Detailed Analysis
            </CardTitle>
            <CardDescription className="leading-none text-xs lg:text-sm flex flex-col">
              Exam analysis on every aspect
              <span className="hidden lg:flex items-center justify-end mt-[5px]">
                <span className="min-w-44 flex items-center justify-between lg:gap-4 text-sm font-semibold">
                  <p>Exam Average</p>
                  <p>/</p>
                  <p>Total Average</p>
                </span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-t sm:p-0">
              <dl className="sm:divide-y">
                <div className="py-2 px-2 flex flex-col sm:gap-2">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <dt className="text-sm lg:text-base font-semibold flex items-center justify-center gap-2">
                      Total time spent
                      <Clock
                        className="text-foreground/80 hidden lg:block"
                        size={18}
                      />
                    </dt>
                    <span className="lg:min-w-44 flex items-center justify-center lg:justify-around gap-2 lg:gap-4 text-sm lg:text-base font-semibold">
                      <p
                        className={`${getFeedbackColor(
                          result.exam.duration,
                          result.timeSpent
                        )}`}
                      >
                        {formatTime(examTimeSpent)}
                      </p>
                      <p>/</p>
                      <p className="text-foreground flex items-center justify-center gap-2">
                        {formatTime(totalAverageTimeSpent)}
                        <InfoPopover text="Average time spent per exam" />
                      </p>
                    </span>
                  </div>
                </div>
                <div className="py-2 px-2 flex flex-col sm:gap-2">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <dt className="text-sm lg:text-base font-semibold flex items-center justify-center gap-2">
                      Time per question
                      <Clock
                        className="text-foreground/80 hidden lg:block"
                        size={18}
                      />
                    </dt>
                    <span className="lg:min-w-44 flex items-center justify-center lg:justify-around gap-2 lg:gap-4 text-sm lg:text-base font-semibold">
                      <p
                        className={`${getFeedbackColor(
                          result.exam.duration / result.exam.totalQuestions,
                          result.timeSpent / result.exam.totalQuestions
                        )}`}
                      >
                        {formatTime(examPerQuestionTimeSpent)}
                      </p>
                      <p>/</p>
                      <p className="text-foreground flex items-center justify-center gap-2">
                        {formatTime(totalAverageTimeSpentperQuestion)}
                        <InfoPopover text="Average time spent per question overall" />
                      </p>
                    </span>
                  </div>
                </div>
                <div className="py-2 px-2 flex flex-col sm:gap-2">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <dt className="text-sm lg:text-base font-semibold flex items-center justify-center gap-2">
                      Accuracy
                      <CheckCheck
                        className="text-foreground/80 hidden lg:block"
                        size={18}
                      />
                    </dt>
                    <span className="lg:min-w-44 flex items-center justify-center lg:justify-around gap-2 lg:gap-4 text-sm lg:text-base font-semibold">
                      <p
                        className={`${getAccuracyColor(
                          (examCorrect / examAttempted) * 100
                        )}`}
                      >
                        {examAccuracy}%
                      </p>
                      <p>/</p>
                      <p className="text-foreground flex items-center justify-center gap-2">
                        {totalAverageAccuracy}%
                        <InfoPopover text="Average overall accuracy" />
                      </p>
                    </span>
                  </div>
                </div>
                <div className="py-2 px-2 flex flex-col sm:gap-2">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <dt className="text-sm lg:text-base font-semibold flex items-center justify-center gap-2">
                      Wrong Answered
                      <X
                        className="text-foreground/80 hidden lg:block"
                        size={18}
                      />
                    </dt>
                    <span className="lg:min-w-44 flex items-center justify-center lg:justify-around gap-2 lg:gap-4 text-sm lg:text-base font-semibold">
                      <p className={`text-chart-fail`}>{examWrong}</p>
                      <p>/</p>
                      <p className="text-foreground flex items-center justify-center gap-2">
                        {totalWrongAnswers / totalExamsTaken}
                        <InfoPopover text="Average no of wrong answers per exam" />
                      </p>
                    </span>
                  </div>
                </div>
                <div className="py-2 px-2 flex flex-col sm:gap-2">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <dt className="text-sm lg:text-base font-semibold flex items-center justify-center gap-2">
                      Unanswered
                      <MessageSquareOff
                        className="text-foreground/80 hidden lg:block"
                        size={18}
                      />
                    </dt>
                    <span className="lg:min-w-44 flex items-center justify-center lg:justify-around gap-2 lg:gap-4 text-sm lg:text-base font-semibold">
                      <p className={`text-yellow-600 dark:text-yellow-500`}>
                        {examUnanswered}
                      </p>
                      <p>/</p>
                      <p className="text-foreground flex items-center justify-center gap-2">
                        {totalUnanswered / totalExamsTaken}
                        <InfoPopover text="Average no of unanswered questions per exam" />
                      </p>
                    </span>
                  </div>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-lg leading-6 font-medium">Detailed Results</h3>
            <p className="mt-1 max-w-2xl text-sm">
              Review your answers and see explanations for each question.
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All questions</SelectItem>
                <SelectItem value="correct">Correct Answers</SelectItem>
                <SelectItem value="wrong">Wrong Answers</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="border-t lg:flex lg:flex-wrap">
          {filteredQuestions.length === 0 ? (
            <div className="px-4 py-5 text-center w-full">
              <p className="text-foreground/70 text-xl font-semibold">
                Nothing found.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question: Question, index: number) => {
              const answer = answersMap[question.id];
              const isCorrect = answer?.is_correct;
              const selectedOption = answer?.selected_option;

              return (
                <div key={question.id} className="px-4 py-5 lg:w-1/2 sm:px-6 ">
                  <div className="mb-4">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 font-medium h-5 w-5  mr-2">
                        {index + 1}.
                      </span>
                      <div className="w-full">
                        <h4 className="text-base font-medium">
                          {question.questionText}
                          <span className="ml-1 text-blue-500">
                            {selectedOption === -1 && "(*Unanswered)"}
                          </span>
                        </h4>
                        <div className="mt-4 space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-md ${
                                selectedOption === optIndex
                                  ? isCorrect
                                    ? "bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-500"
                                    : "bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-500"
                                  : question.correctAnswer === optIndex
                                  ? "bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-500"
                                  : "bg-gray-100 dark:bg-muted border border-gray-400 dark:border-border"
                              }`}
                            >
                              <div className="flex items-start">
                                {selectedOption === optIndex ? (
                                  isCorrect ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                  )
                                ) : question.correctAnswer === optIndex ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                ) : (
                                  <span className="h-5 w-5 mr-2 flex-shrink-0"></span>
                                )}
                                <span
                                  className={`text-sm ${
                                    selectedOption === optIndex
                                      ? isCorrect
                                        ? "text-green-700 dark:text-foreground"
                                        : "text-red-700 dark:text-foreground"
                                      : question.correctAnswer === optIndex
                                      ? "text-green-700 dark:text-foreground"
                                      : "text-gray-700 dark:text-foreground"
                                  }`}
                                >
                                  {option}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="mt-4  p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-500">
                            Explanation
                          </h3>
                          <div className="mt-2 text-sm text-blue-500">
                            <p>{question.explanation}</p>
                            {question.reference && (
                              <p className="mt-2">
                                <strong>Reference:</strong> {question.reference}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
