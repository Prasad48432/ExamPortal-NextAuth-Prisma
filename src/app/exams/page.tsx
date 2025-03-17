import React from "react";
import db from "@/lib/db/db";
import { TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExamsList from "./components/examslist";

export default async function Exams() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const exams = await db.exam.findMany();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          <ExamsList exams={exams} userId={session.user?.id || ""} />
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
