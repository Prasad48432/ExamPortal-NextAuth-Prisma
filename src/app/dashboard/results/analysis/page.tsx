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
import { Award, BookOpen, CheckCircle, FileQuestion } from "lucide-react";
import ResultsChart from "./components/examResultsChart";
import ComparisionChart from "./components/ratiosPieChart";
import ExamRatioPieChart from "./components/examRatioPieChart";
import AccuracyChart from "./components/accuracyChart";
import { RadarAnalysisChart } from "./components/completeAnalysisChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
              Attempted exams performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <ResultsChart results={results} />
            ) : (
              <div className="min-h-[318.6px] w-full flex flex-col gap-4 items-center justify-center text-foreground/50">
                <FileQuestion size={60} />
                <p>No data avaiable yet</p>
                <Link href={"/exams"}>
                  <Button className="h-8 px-3" variant={"secondary"}>
                    Take Available Exams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Accuracy Chart
            </CardTitle>
            <CardDescription className="leading-none text-sm">
              Correct to attempted answers ratio every exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <AccuracyChart results={results} />
            ) : (
              <div className="min-h-[318.6px] w-full flex flex-col gap-4 items-center justify-center text-foreground/50">
                <FileQuestion size={60} />
                <p>No data avaiable yet</p>
                <Link href={"/exams"}>
                  <Button className="h-8 px-3" variant={"secondary"}>
                    Take Available Exams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">Ratios Chart</CardTitle>
            <CardDescription className="leading-none">
              Correct-Wrong-Unanswered ratio
              {results.length > 0 && user?.totalExamsTaken! > 0 && (
                <span className="flex items-center justify-around mt-11 text-base font-medium">
                  <p>Last Exam Ratio</p>
                  <p>All Exams Ratio</p>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row">
            {results.length > 0 && user?.totalExamsTaken! > 0 ? (
              <>
                <ExamRatioPieChart result={results[0]} />{" "}
                <ComparisionChart user={user!} />
              </>
            ) : (
              <div className="min-h-[318.6px] w-full flex flex-col gap-4 items-center justify-center text-foreground/50">
                <FileQuestion size={60} />
                <p>No data avaiable yet</p>
                <Link href={"/exams"}>
                  <Button className="h-8 px-3" variant={"secondary"}>
                    Take Available Exams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">
              Complete Analysis
            </CardTitle>
            <CardDescription className="leading-none text-sm">
              All aspects analysed last exam vs average
              {results.length > 0 && user?.totalExamsTaken! > 0 && (
                <span className="flex items-center justify-around mt-11 text-base font-medium">
                  <p>(Last Exam/Average) all aspects analysis</p>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 && user?.totalExamsTaken! > 0 ? (
              <RadarAnalysisChart result={results[0]} user={user!} />
            ) : (
              <div className="min-h-[318.6px] w-full flex flex-col gap-4 items-center justify-center text-foreground/50">
                <FileQuestion size={60} />
                <p>No data avaiable yet</p>
                <Link href={"/exams"}>
                  <Button className="h-8 px-3" variant={"secondary"}>
                    Take Available Exams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
