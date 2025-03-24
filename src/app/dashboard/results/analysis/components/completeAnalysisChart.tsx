"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ExamResult, User } from "@prisma/client";

const chartConfig = {
  lastexam: {
    label: "Last Exam",
    color: "hsl(var(--chart-1))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RadarAnalysisChart({
  result,
  user,
}: {
  result: ExamResult;
  user: User;
}) {
  const chartData = [
    {
      parameter: "Accuracy",
      lastexam: Number(
        (
          (result.totalCorrect! / result.totalQuestionsAttempted!) *
          100
        ).toFixed(1)
      ),
      average: Number((user.totalAccuracy! / user.totalExamsTaken!).toFixed(1)),
    },
    {
      parameter: "Time/Exam",
      lastexam: result.timeSpent,
      average: Number((user.totalTimeSpent! / user.totalExamsTaken!).toFixed(1)),
    },
    {
      parameter: "Time/Question",
      lastexam: Number((result.timeSpent / (result.totalQuestionsAttempted! +result.totalUnanswered!)).toFixed(1)),
      average: Number((user.totalTimeSpent! / (user.totalQuestionsAttempted! +user.totalUnanswered!)).toFixed(1)),
    },
    {
      parameter: "Unanswered",
      lastexam: Number(
        (
          (result.totalUnanswered! /
            (result.totalQuestionsAttempted! + result.totalUnanswered!)) *
          100
        ).toFixed(1)
      ),
      average: Number(
        (
          (user.totalUnanswered! /
            user.totalExamsTaken! /
            ((user.totalQuestionsAttempted! + user.totalUnanswered!) /
              user.totalExamsTaken!)) *
          100
        ).toFixed(1)
      ),
    },
    {
      parameter: "Wrong",
      lastexam: Number(
        ((result.totalWrong! / result.totalQuestionsAttempted!) * 100).toFixed(
          1
        )
      ),
      average: Number(
        (
          (user.totalWrong! /
            user.totalExamsTaken! /
            (user.totalQuestionsAttempted! / user.totalExamsTaken!)) *
          100
        ).toFixed(1)
      ),
    },
    {
      parameter: "Correct",
      lastexam: Number(
        (
          (result.totalCorrect! / result.totalQuestionsAttempted!) *
          100
        ).toFixed(1)
      ),
      average: Number(
        (
          (user.totalCorrect! /
            user.totalExamsTaken! /
            (user.totalQuestionsAttempted! / user.totalExamsTaken!)) *
          100
        ).toFixed(1)
      ),
    },
  ];
  return (
    <ChartContainer
      config={chartConfig}
      className=" w-full aspect-square max-h-[250px]"
    >
      <RadarChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey="parameter" />
        <PolarGrid />
        <Radar dataKey="average" fill="var(--color-average)" />
        <Radar
          dataKey="lastexam"
          fill="var(--color-lastexam)"
          fillOpacity={0.6}
        />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}
