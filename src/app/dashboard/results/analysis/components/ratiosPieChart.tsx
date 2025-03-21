"use client";
import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import type { User } from "@prisma/client";

const RatiosPieChart = ({ user }: { user: User }) => {
  const totalAnswers =  user.totalCorrect! + user.totalWrong! + user.totalUnanswered!;

  const chartData = [
    {
      type: "correct",
      questions: user.totalCorrect,
      fill: "hsl(var(--chart-success))",
    },
    {
      type: "wrong",
      questions: user.totalWrong,
      fill: "hsl(var(--chart-fail))",
    },
    {
      type: "unanswered",
      questions: user.totalUnanswered,
      fill: "hsl(var(--chart-warning))",
    },
  ];


  const chartConfig: ChartConfig = {
    questions: {
      label: "Questions",
    },
    correct: { label: "Correct", color: "hsl(var(--chart-success))" },
    wrong: { label: "Wrong", color: "hsl(var(--chart-fail))" },
    unanswered: { label: "Unanswered", color: "hsl(var(--chart-warning))" }, // Yellow
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[250px] w-full lg:w-[50%]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="questions"
          nameKey="type"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalAnswers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Questions
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="type" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
};

export default RatiosPieChart;
