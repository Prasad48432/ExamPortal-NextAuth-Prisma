"use client";
import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, LabelList } from "recharts";
import type { Exam, ExamResult } from "@prisma/client";

interface ExamResultWithExam extends ExamResult {
  exam: Exam;
}

const ResultsChart = ({ results }: { results: ExamResultWithExam[] }) => {
  const chartData2 = results.map((result) => ({
    exam: result.exam?.title || "Unknown Exam",
    score: result.score,
  }));

  const chartConfig = {
    score: {
      label: "Score %",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData2}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="exam"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const { exam, score } = payload[0].payload;
              return (
                <div className="bg-muted p-2 rounded-md shadow text-sm">
                  <p className="font-semibold">{exam}</p> <p>Score: {score}%</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="score" fill="var(--color-score)" radius={4}>
          <LabelList
            position="top"
            offset={6}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default ResultsChart;
