"use client";
import { BookOpen, CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import type { ExamResult, Exam, Question } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ScoreBadge from "../../../components/scorebadge";
import ExamStatusBadge from "../../../components/statusbadge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExamResultWithExam = ExamResult & { exam: Exam };

const ResultSection = ({
  result,
  gotQuestions,
  answersMap,
}: {
  result: ExamResultWithExam;
  gotQuestions: Question[];
  answersMap: any;
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

  return (
    <div className="w-full">
      <div className="px-4 py-1 sm:px-6 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href="/results"
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
        <Card className="w-full lg:min-h-[415px] lg:w-1/2 border bg-card text-card-foreground shadow">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-base lg:text-lg leading-6 font-medium text-primary">
              Result Summary
            </h3>
            <p className="mt-1 max-w-2xl text-xs lg:text-sm">
              Completed on:{" "}
              <span className="text-foreground/80">
                {result.completedAt
                  ? new Date(result.completedAt).toLocaleString()
                  : "Not completed"}
              </span>
            </p>
            <p className="mt-1 max-w-2xl text-xs lg:text-sm">
              Attempt id:{" "}
              <span className="text-foreground/80">{result.id}</span>
            </p>
          </div>
          <div className="border-t  px-4 py-5 sm:p-0">
            <dl className="sm:divide-y">
              <div className="py-4 sm:py-5 flex flex-row items-center justify-between sm:gap-4 sm:px-6">
                <dt className="text-sm lg:text-base font-medium ">Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ScoreBadge score={result.score} />
                </dd>
              </div>
              <div className="py-4 sm:py-5 flex flex-row items-center justify-between sm:gap-4 sm:px-6">
                <dt className="text-sm lg:text-base font-medium">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ExamStatusBadge
                    score={result.score}
                    passingScore={result.exam.passingScore}
                  />
                </dd>
              </div>
              <div className="py-4 sm:py-5 flex flex-row items-center justify-between sm:gap-4 sm:px-6">
                <dt className="text-sm lg:text-base font-medium">
                  Correct Answers
                </dt>
                <dd className="mt-1 text-sm lg:text-base font-medium text-green-500 sm:mt-0 sm:col-span-2">
                  {Array.isArray(result.answers)
                    ? (result.answers as any[]).filter((a) => a?.is_correct)
                        .length
                    : 0}
                </dd>
              </div>
              <div className="py-4 sm:py-5 flex flex-row items-center justify-between sm:gap-4 sm:px-6">
                <dt className="text-sm lg:text-base font-medium">
                  Wrong Answers
                </dt>
                <dd className="mt-1 text-sm lg:text-base font-medium text-red-500 sm:mt-0 sm:col-span-2">
                  {Array.isArray(result.answers)
                    ? (result.answers as any[]).filter(
                        (a) => !a?.is_correct && a?.selected_option !== -1
                      ).length
                    : 0}
                </dd>
              </div>
              <div className="py-4 sm:py-5 flex flex-row items-center justify-between sm:gap-4 sm:px-6">
                <dt className="text-sm lg:text-base font-medium">Unanswered</dt>
                <dd className="mt-1 text-sm lg:text-base font-medium text-yellow-500 sm:mt-0 sm:col-span-2">
                  {Array.isArray(result.answers)
                    ? (result.answers as any[]).filter(
                        (a) => a?.selected_option === -1
                      ).length
                    : 0}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
        <Card className="w-full lg:min-h-[415px] lg:w-1/2 border bg-card text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">
              Bar Chart - Multiple
            </CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="month" />
                <PolarGrid />
                <Radar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  fillOpacity={0.6}
                />
                <Radar dataKey="mobile" fill="var(--color-mobile)" />
              </RadarChart>
            </ChartContainer>
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
          {/* <select
            className="border rounded-md p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All questions</option>
            <option value="correct">Correct Answers</option>
            <option value="wrong">Wrong Answers</option>
            <option value="unanswered">Unanswered</option>
          </select> */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              className="w-[180px]"
            >
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
          {filteredQuestions.map((question: Question, index: number) => {
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
