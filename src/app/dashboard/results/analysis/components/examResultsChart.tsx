"use client";
import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, LabelList, Cell } from "recharts";
import type { Exam, ExamResult } from "@prisma/client";
import { BookOpenCheck, Tally5 } from "lucide-react";

interface ExamResultWithExam extends ExamResult {
  exam: Exam;
}

const ResultsChart = ({ results }: { results: ExamResultWithExam[] }) => {
  const chartData = results.map((result) => ({
    exam: result.exam?.title || "Unknown Exam",
    score: result.score,
    passed: result.examPassed ? "Passed" : "Failed",
    resultClass: result.examPassed ? "text-chart-success" : "text-chart-fail",
  }));

  const chartConfig = {
    score: {
      label: "Score %",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="exam"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            value.length > 10 ? value.slice(0, 10) + "..." : value
          }
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const { exam, score, passed, resultClass } = payload[0].payload;
              return (
                <div className="bg-background border p-2 rounded-md shadow text-xs">
                  <p className="font-medium mb-1 text-foreground/80">{exam}</p>
                  <span className="flex items-center font-light gap-1 mb-0.5 text-foreground/60">
                    <Tally5 size={13} className="mr-1" />
                    Score:{" "}
                    <p className="font-semibold ml-1 text-foreground/80">
                      {score}%
                    </p>
                  </span>
                  <span className="flex items-center font-light gap-1 text-foreground/60">
                    <BookOpenCheck size={13} className="mr-1" />
                    Status:{" "}
                    <p className={`${resultClass} font-semibold ml-1`}>
                      {passed}
                    </p>
                  </span>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="score" radius={4}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                results[index].examPassed
                  ? "hsl(var(--chart-success))"
                  : "hsl(var(--chart-fail))"
              }
            />
          ))}
          <LabelList
            position="top"
            offset={6}
            className="fill-foreground mt-1"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default ResultsChart;
