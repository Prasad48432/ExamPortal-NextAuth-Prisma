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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-4 w-full">
        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 " />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate">
                    Total Exams Taken
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-primary">
                      {results.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 " />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Average Score
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-primary">
                      {results.length > 0
                        ? `${(
                            results.reduce(
                              (acc, result) => acc + result.score,
                              0
                            ) / results.length
                          ).toFixed(2)}%`
                        : "N/A"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 " />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Highest Score
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-primary">
                      {results.length > 0
                        ? `${Math.max(
                            ...results.map((result) => result.score)
                          )}%`
                        : "N/A"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
        <Card className="w-full lg:w-1/2 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-tight">
              Performance Chart
            </CardTitle>
            <CardDescription className="leading-tight">
              Attempted Exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsChart results={results} />
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-tight">
              Bar Chart - Multiple
            </CardTitle>
            <CardDescription className="leading-tight">
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
