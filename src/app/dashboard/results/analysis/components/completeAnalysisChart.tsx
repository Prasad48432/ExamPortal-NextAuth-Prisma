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
      lastexam: (result.totalCorrect! / result.totalQuestionsAttempted!) * 100,
      average: (user.totalCorrect! / user.totalQuestionsAttempted!) * 100,
    },
    {
      parameter: "Time/Exam",
      lastexam: result.timeSpent,
      average: user.totalTimeSpent! / user.totalExamsTaken!,
    },
    {
      parameter: "Time/Question",
      lastexam:
        result.timeSpent / result.totalQuestionsAttempted! +
        result.totalUnanswered!,
      average:
        user.totalTimeSpent! / user.totalQuestionsAttempted! +
        user.totalUnanswered!,
    },
    {
      parameter: "Unanswered",
      lastexam:
        (result.totalUnanswered! /
          (result.totalQuestionsAttempted! + result.totalUnanswered!)) *
        100,
      average:
        (user.totalUnanswered! /
          user.totalExamsTaken! /
          ((user.totalQuestionsAttempted! + user.totalUnanswered!) /
            user.totalExamsTaken!)) *
        100,
    },
    {
      parameter: "Correct",
      lastexam: (result.totalCorrect! / result.totalQuestionsAttempted!) * 100,
      average:
        (user.totalCorrect! /
          user.totalExamsTaken! /
          (user.totalQuestionsAttempted! / user.totalExamsTaken!)) *
        100,
    },
    {
      parameter: "Wrong",
      lastexam: (result.totalWrong! / result.totalQuestionsAttempted!) * 100,
      average:
        (user.totalWrong! /
          user.totalExamsTaken! /
          (user.totalQuestionsAttempted! / user.totalExamsTaken!)) *
        100,
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
