import ScoreBadge from "@/components/scorebadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { formatTime } from "@/lib/utils/timeFomat";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SavedExams from "./components/savedExams";
import { formatDateTime } from "@/lib/utils/dateTimeFormat";

const HomePage = async () => {
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

  const savedExams = await db.savedExam.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      exam: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-4 w-full">
        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate">Exams Taken</dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
                      {results.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Pass Percentage
                  </dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
                      {results.length > 0
                        ? `${(
                            (results.filter((result) => result.examPassed)
                              .length /
                              results.length) *
                            100
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
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Average Score
                  </dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
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
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Average Accuracy
                  </dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
                      {user?.totalAccuracy === 0 && user?.totalExamsTaken === 0
                        ? "N/A"
                        : (
                            (user?.totalAccuracy ?? 0) /
                            (user?.totalExamsTaken || 1)
                          ).toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Highest Score
                  </dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
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
        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <div className="p-3 lg:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 " />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium  truncate">
                    Total Time Spent
                  </dt>
                  <dd>
                    <div className="text-base font-medium text-primary">
                      {results.length > 0
                        ? formatTime(
                            results.reduce(
                              (acc, result) => acc + (result.timeSpent || 0),
                              0
                            )
                          )
                        : "N/A"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-4 w-full">
        <Card className="border bg-sidebar/80 text-card-foreground shadow">
          <CardHeader>
            <CardTitle className="text-lg leading-none">Recent exams</CardTitle>
            <CardDescription className="leading-none">
              Exams atempted recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center w-full divide-y divide-border">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <h1 className="text-xl font-semibold text-foreground/60">
                    No exams attempted
                  </h1>
                  <Link href={"/exams"}>
                    <Button className="h-8 px-3">Browse Available Exams</Button>
                  </Link>
                </div>
              ) : (
                results.slice(0, 3).map((result) => (
                  <div className="w-full py-2" key={result.id}>
                    <Link
                      href={`/dashboard/results/${result.id}`}
                      className="block w-full"
                    >
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm lg:text-base font-medium truncate">
                          {result.exam?.title || "Unknown Exam"}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ScoreBadge
                            score={result.score}
                            passed={result.examPassed}
                          />
                        </div>
                      </div>
                      <div className="mt-1 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-foreground/60">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {result.completedAt
                              ? formatDateTime(result.completedAt)
                              : "Not completed"}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-foreground/80 sm:mt-0">
                          <span className="text-foreground/70 hover:text-foreground hover:underline flex items-center justify-center">
                            View details{" "}
                            <ChevronRight size={18} strokeWidth={1} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Link
              href={`/dashboard/results`}
              className="flex items-center justify-center"
            >
              <Button variant={"link"}>
                View all <ChevronRight size={18} strokeWidth={1} />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <SavedExams savedExams={savedExams} userId={session?.user?.id || ""} />
      </div>
    </div>
  );
};

export default HomePage;
