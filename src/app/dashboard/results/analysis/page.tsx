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
import ComparisionChart from "./components/ratiosPieChart";
import ExamRatioPieChart from "./components/examRatioPieChart";
import AccuracyChart from "./components/accuracyChart";

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

  const user = await db.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-4 w-full">
        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
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

        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">Ratios Chart</CardTitle>
            <CardDescription className="leading-none">
              Correct-Wrong-Unanswered ratio
              <span className="flex items-center justify-around mt-11 text-base font-medium">
                <p>Last Exam Ratio</p>
                <p>All Exams Ratio</p>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row">
            <ExamRatioPieChart result={results[0]} />
            <ComparisionChart user={user!} />
          </CardContent>
        </Card>

        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Accuracy Chart
            </CardTitle>
            <CardDescription className="leading-none">
              Correct to attempted answers ratio every exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccuracyChart results={results} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
