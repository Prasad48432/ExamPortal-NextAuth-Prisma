import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ScoreBadge from "../../components/scorebadge";

export default async function Results() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const results = await db.examResult.findMany({
    orderBy: {
      completedAt: "desc", // Sort by score in descending order
    },
    where: {
      status: "completed",
    },
    include: {
      exam: true,
    },
  });
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold">
              Your Exam Results
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/exams"
              className="inline-flex items-center rounded-md text-xs font-medium "
            >
              <Button className="h-8 text-xs">Take Another Exam</Button>
            </Link>
          </div>
        </div> */}
          <div className="flex-1">
            {results.length > 0 ? (
              <div className="overflow-hidden sm:rounded-md">
                <ul className="space-y-3">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link href={`/results/${result.id}`} className="block">
                        <Card className="px-4 py-4 sm:px-6 border bg-card text-card-foreground shadow">
                          <div className="flex items-center justify-between">
                            <p className="text-sm lg:text-base font-medium text-primary truncate">
                              {result.exam?.title || "Unknown Exam"}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <ScoreBadge score={result.score} />
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm ">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
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
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  {result.score >=
                                  (result.exam?.passingScore || 70) ? (
                                    <CheckCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-red-500" />
                                  )}
                                  {result.score >=
                                  (result.exam?.passingScore || 70) ? (
                                    <span className="text-green-500">
                                      Passed
                                    </span>
                                  ) : (
                                    <span className="text-red-500">Failed</span>
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-foreground/80 sm:mt-0">
                              <span className="hover:underline">
                                View details
                              </span>
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
                      You haven't taken any exams yet. Start by taking an exam
                      to see your results here.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      href="/exams"
                      className="inline-flex items-center text-sm font-medium"
                    >
                      <Button className="h-8 px-3">
                        Browse Available Exams
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-80">
            <div className="relative lg:sticky top-10 lg:top-20 flex flex-col items-start justify-center">
              <h3 className="font-semibold mb-4 text-lg text-lightprimary-text dark:text-primary-text">
                Discover more topics
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Programming",
                  "Data Science",
                  "Technology",
                  "Self Improvement",
                  "Writing",
                  "Relationships",
                  "Machine Learning",
                  "Productivity",
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 rounded-full text-lightprimary-text dark:text-primary-text border border-lightsecondary-border dark:border-secondary-border text-sm bg-lightsecondary-bg dark:bg-secondary-bg"
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <h3 className="font-semibold mb-4 text-lg flex items-center justify-center gap-2 text-lightprimary-text dark:text-primary-text">
                Discover trending profiles <TrendingUp className="w-5 h-5" />
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
