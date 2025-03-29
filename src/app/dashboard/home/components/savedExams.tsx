"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import type { Exam, SavedExam } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, Clock } from "lucide-react";
import { startExam } from "@/lib/actions/questionActions";
import { redirect } from "next/navigation";
import { ToastError } from "@/components/toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

type SavedExamWithExam = SavedExam & {
  exam: Exam;
};

const SavedExams = ({
  savedExams,
  userId,
}: {
  savedExams: SavedExamWithExam[];
  userId: string;
}) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleStartExam = async ({
    userId,
    examId,
  }: {
    userId: string;
    examId: string;
  }) => {
    setLoading(true);
    const response = await startExam(userId, examId);

    if (response.success) {
      setLoading(false);
      closeModal();
      redirect(`/exams/${examId}?attemptId=${response.examResult?.id}`);
    } else {
      ToastError({ message: response.message || "error" });
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="border bg-sidebar/80 text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="text-lg leading-none">Exam savelist</CardTitle>
          <CardDescription className="leading-none">
            Your saved exams list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full divide-y divide-border">
            {savedExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <h1 className="text-xl font-semibold text-foreground/60">
                  Nothing saved yet.
                </h1>
                <Link href={"/exams"}>
                  <Button className="h-8 px-3">Bookmark avaialble exams</Button>
                </Link>
              </div>
            ) : (
              savedExams.slice(0, 3).map((savedexam) => (
                <div className="w-full py-2" key={savedexam.id}>
                  <div className="block w-full">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm lg:text-base font-medium truncate">
                        {savedexam.exam?.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Button
                          onClick={() => openModal(savedexam.exam)}
                          className="h-6 px-2 text-xs"
                        >
                          Start Now
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1 sm:flex sm:justify-between">
                      <p className="text-xs lg:text-sm font-medium max-w-[80%] truncate text-foreground/70">
                        {savedexam.exam?.description}
                      </p>
                      <p className="flex items-center justify-center text-xs text-card-foreground">
                        <Clock className="flex-shrink-0 mr-1 h-3 w-3 text-primary" />
                        {savedexam.exam.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Link
            href={`/exams`}
            className="flex items-center justify-center"
          >
            <Button variant={"link"}>
              View all <ChevronRight size={18} strokeWidth={1} />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      {selectedExam && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="bg-muted/40" />
          <DialogContent className="gap-1">
            <DialogHeader>
              <DialogTitle>{selectedExam.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm mb-4">{selectedExam.description}</p>
            <div className="border-l-4 border-yellow-400 dark:border-yellow-800 py-2 px-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    Important Instructions
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-500">
                    <ul className="list-disc pl-1 space-y-1">
                      <li>The exam will be conducted in full-screen mode</li>
                      <li>
                        Switching tabs or minimizing the window will trigger a
                        warning
                      </li>
                      <li>
                        Multiple violations will result in automatic submission
                      </li>
                      <li>Ensure you have a stable internet connection</li>
                      <li>
                        You have {selectedExam.duration} minutes to complete the
                        exam
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="h-8 px-3"
                variant="secondary"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                className="h-8 px-3"
                disabled={loading}
                onClick={() =>
                  handleStartExam({ userId: userId, examId: selectedExam.id })
                }
              >
                {loading ? (
                  <>
                    <span>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                    Starting...
                  </>
                ) : (
                  "Start"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SavedExams;
