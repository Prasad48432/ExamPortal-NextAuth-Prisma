import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import db from "@/lib/db/db";
import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ScoreBadge from "@/components/scorebadge";
import { auth } from "@/lib/auth";
import { formatTime } from "@/lib/utils/timeFomat";

export default async function Results() {
  const session = await auth();
  const results = await db.examResult.findMany({
    orderBy: {
      completedAt: "desc", // Sort by score in descending order
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
      <div className="flex w-full">
        {results.length > 0 ? (
          <div className="overflow-hidden w-full">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((result) => (
                <li className="col-span-1" key={result.id}>
                  <Link
                    href={`/dashboard/results/${result.id}`}
                    className="block"
                  >
                    <Card className="px-4 py-4 sm:px-6 border bg-card text-card-foreground shadow">
                      <div className="flex items-center justify-between">
                        <p className="text-sm lg:text-base font-medium text-primary truncate">
                          {result.exam?.title || "Unknown Exam"}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ScoreBadge
                            score={result.score}
                            passed={result.examPassed}
                          />
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm ">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-foreground/70" />
                            {result.completedAt
                              ? new Date(result.completedAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )
                              : "Not completed"}
                          </p>
                          {result.score && (
                            <p className="mt-2 flex items-center text-sm sm:mt-0 sm:ml-6">
                              {result.score >=
                              (result.exam?.passingScore || 70) ? (
                                <CheckCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-500" />
                              )}
                              {result.score >=
                              (result.exam?.passingScore || 70) ? (
                                <span className="text-green-500">Passed</span>
                              ) : (
                                <span className="text-red-500">Failed</span>
                              )}
                            </p>
                          )}
                          {result.startedAt && result.completedAt && (
                            <p className="mt-2 flex items-center text-sm sm:mt-0 sm:ml-6">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-foreground/70" />
                              {formatTime(result.timeSpent)}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-foreground/80 sm:mt-0">
                          <span className="hover:underline">View details</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium">
                No exam results yet
              </h3>
              <div className="mt-2 max-w-xl text-sm text-foreground/80">
                <p>
                  You haven't taken any exams yet. Start by taking an exam to
                  see your results here.
                </p>
              </div>
              <div className="mt-5">
                <Link
                  href="/exams"
                  className="inline-flex items-center text-sm font-medium"
                >
                  <Button className="h-8 px-3">Browse Available Exams</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
