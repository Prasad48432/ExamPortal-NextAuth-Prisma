import React from "react";
import db from "@/lib/db/db";
import { TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExamsList from "./components/examslist";

export default async function Exams() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const exams = await db.exam.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      savedBy: true,
    },
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          <ExamsList exams={exams} userId={session.user?.id || ""} />
          <div className="w-full lg:w-80">
            <div className="relative lg:sticky top-10 lg:top-20 flex flex-col items-start justify-center">
              <h3 className="font-semibold mb-4 text-lg text-lightprimary-text dark:text-primary-text">
                Discover more exams
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
                Discover trending exams <TrendingUp className="w-5 h-5" />
              </h3>
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <div className="w-full rounded-lg h-20 border flex items-start justify-center p-2 gap-3">
                  <img
                    className="rounded-md h-full w-[30%] object-cover"
                    src="https://wpblogassets.paytm.com/paytmblog/uploads/2023/08/Blogs_Paytm_Bond-Market-vs.-Stock-Market_-Whats-the-Difference_-1-1024x640.jpg"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h1 className="font-semibold">Stock Hero</h1>
                    <p className="line-clamp-2 text-xs">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Qui, id. Maiores saepe voluptates numquam placeat dolorum!
                      Fugit odit totam exercitationem quasi voluptatem libero
                      maiores architecto cum, quos minus dolorum deleniti?
                    </p>
                  </div>
                </div>
                <div className="w-full rounded-lg h-20 border flex items-start justify-center p-2 gap-3">
                  <img
                    className="rounded-md h-full w-[30%] object-cover"
                    src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221222184908/web-development1.png"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h1 className="font-semibold">Web Development</h1>
                    <p className="line-clamp-2 text-xs">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Qui, id. Maiores saepe voluptates numquam placeat dolorum!
                      Fugit odit totam exercitationem quasi voluptatem libero
                      maiores architecto cum, quos minus dolorum deleniti?
                    </p>
                  </div>
                </div>
                <div className="w-full rounded-lg h-20 border flex items-start justify-center p-2 gap-3">
                  <img
                    className="rounded-md h-full w-[30%] object-cover"
                    src="https://www.investopedia.com/thmb/NrxrUsas9jwJNuNYqcwf7sWeCWA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/bank-47189639b37541338a6f383147cba708.jpg"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h1 className="font-semibold">Banking Basics</h1>
                    <p className="line-clamp-2 text-xs">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Qui, id. Maiores saepe voluptates numquam placeat dolorum!
                      Fugit odit totam exercitationem quasi voluptatem libero
                      maiores architecto cum, quos minus dolorum deleniti?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
