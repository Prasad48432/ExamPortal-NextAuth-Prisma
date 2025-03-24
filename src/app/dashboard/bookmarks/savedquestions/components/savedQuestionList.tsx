"use client";
import { ToastError } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { saveQuestion } from "@/lib/actions/examActions";
import type { BookmarkedQuestion, Question } from "@prisma/client";
import { BookMarked, LinkIcon, Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

type Questions = BookmarkedQuestion & {
  question: Question;
};

const SavedQuestionList = ({
  questions,
  userId,
}: {
  questions: Questions[];
  userId: string;
}) => {
  const [savedQuestions, setSavedQuestions] = useState<Questions[]>(questions);
  const [bookmarkLoading, setBookMarkLoading] = useState(false);

  const handleQuestionRemove = async ({
    userId,
    questionId,
    examId,
    action,
  }: {
    userId: string;
    questionId: string;
    examId: string;
    action: string;
  }) => {
    setBookMarkLoading(true);
    const response = await saveQuestion(userId, questionId, examId, action);

    if (response.success) {
      setSavedQuestions((prev) =>
        prev.filter((question) => question.question.id !== questionId)
      );
      setBookMarkLoading(false);
    } else {
      ToastError({ message: "Error removing exam" });
      setBookMarkLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
        {savedQuestions.map((question, index) => (
          <div
            className="w-full flex flex-col col-span-1 p-2 relative border rounded-md"
            key={index}
          >
            <Button
              className="absolute top-2 right-2 h-8 w-8"
              size={"icon"}
              variant={"outline"}
              onClick={() => {
                handleQuestionRemove({
                  userId: userId,
                  questionId: question.question.id,
                  examId: question.examId,
                  action: "delete",
                });
              }}
            >
              {bookmarkLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash size={18} className="text-chart-fail" />
              )}
            </Button>
            {/* Question text */}
            <h4 className="text-base font-medium mb-4 w-[95%]">
              {question.question.questionText}
            </h4>

            {question.question.questionImage && (
              <Image
                className="my-4 w-[60%] object-cover"
                src={question.question.questionImage}
                alt="Question Image"
                width={600}
                height={400}
                layout="responsive"
              />
            )}

            <div className="space-y-2">
              {question.question.options.map((option, optIndex) => {
                const isCorrect = optIndex === question.question.correctAnswer;

                return (
                  <div key={optIndex} className="flex items-center">
                    <div
                      className={`relative w-4 h-4 rounded-full border-2 ${
                        isCorrect ? "border-green-500" : "border-gray-400"
                      } flex items-center justify-center`}
                    >
                      {isCorrect && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>

                    <label
                      className={`ml-2 text-sm font-medium ${
                        isCorrect ? "text-green-500" : "text-foreground/80"
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-start justify-center mt-4 p-2 bg-muted rounded-md gap-3 text-sm w-full">
              <div className="flex items-start justify-start gap-2 w-full">
                <div className="min-w-4 mt-1">
                  <BookMarked strokeWidth={1} className="w-4 h-4" />
                </div>
                <p className="flex items-center">
                  {question.question.explanation}
                </p>
              </div>

              <div className="flex items-start justify-start gap-2 w-full">
                <div className="min-w-4 mt-1">
                  <LinkIcon strokeWidth={1} className="w-4 h-4" />
                </div>
                <a
                  href={`${question.question.reference}`}
                  target="_blank"
                  className="flex underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 items-center break-all md:break-words overflow-hidden"
                >
                  {question.question.reference}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedQuestionList;
