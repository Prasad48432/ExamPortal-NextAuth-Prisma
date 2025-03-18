import React from "react";
import db from "@/lib/db/db";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, BookOpen, CheckCircle } from "lucide-react";
import ResultsChart from "./components/examResultsChart";
import ComparisionChart from "./components/comparisionChart";

const Results = async () => {
  const session = await auth();

  const results = await db.examResult.findMany({
    orderBy: {
      completedAt: "desc",
    },
    where: {
      status: "completed",
      userId: session?.user?.id,
    },
    include: {
      exam: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
        <Card className="w-full lg:w-1/2 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Performance Chart
            </CardTitle>
            <CardDescription className="leading-none">
              Attempted Exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsChart results={results} />
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Bar Chart - Multiple
            </CardTitle>
            <CardDescription className="leading-none">
              January - June 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComparisionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
