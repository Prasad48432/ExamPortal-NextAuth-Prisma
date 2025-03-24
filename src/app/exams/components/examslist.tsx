"use client";
import {
  AlertCircle,
  Bookmark,
  Clock,
  FileText,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import type { Exam, SavedExam } from "@prisma/client";
import { startExam } from "@/lib/questionActions";
import { ToastError } from "@/components/toast";
import { redirect } from "next/navigation";
import { saveExam } from "@/lib/actions/examActions";

type ExamWithSavedBy = Exam & {
  savedBy: SavedExam[];
};

const ExamsList = ({
  exams,
  userId,
}: {
  exams: ExamWithSavedBy[];
  userId: string;
}) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const [savedExams, setSavedExams] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      exams.map((exam) => [
        exam.id,
        exam.savedBy.some((saved) => saved.userId === userId),
      ])
    )
  );

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

  const handleExamSave = async ({
    userId,
    examId,
    action,
  }: {
    userId: string;
    examId: string;
    action: string;
  }) => {
    const response = await saveExam(userId, examId, action);
    if (response.success) {
      if (action === "add") {
        setSavedExams((prev) => ({
          ...prev,
          [examId]: !prev[examId],
        }));
      } else if (action === "delete") {
        setSavedExams((prev) => ({
          ...prev,
          [examId]: !prev[examId],
        }));
      }
    } else {
      ToastError({ message: "Error saving exam" });
    }
  };

  return (
    <div className="flex-1">
      <div>
        <div className="flex items-center space-x-2 mb-8 text-lightprimary-text dark:text-primary-text">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Trending on Exam portal</span>
        </div>
        <ul className="space-y-3">
          {exams.map((exam) => (
            <li key={exam.id}>
              <Card className="px-4 py-4 sm:px-6 border bg-card text-card-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium truncate text-primary">
                      {exam.title}
                    </h3>
                    <p className="mt-1 text-sm text-card-foreground sm:truncate">
                      {exam.description}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-2">
                    <Button
                      onClick={() => openModal(exam)}
                      className="inline-flex items-center h-8 px-3 w-full sm:w-auto"
                    >
                      Start Exam
                    </Button>
                    <Button
                      onClick={() =>
                        handleExamSave({
                          userId: userId,
                          examId: exam.id,
                          action: savedExams[exam.id] ? "delete" : "add",
                        })
                      }
                      className="h-8 w-8 flex lg:hidden"
                      variant={"outline"}
                      size={"icon"}
                    >
                      {savedExams[exam.id] ? (
                        <Bookmark size={18} className="fill-foreground" />
                      ) : (
                        <Bookmark size={18} />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap sm:space-x-4">
                    <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      {exam.duration} minutes
                    </p>
                    <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto mt-2 sm:mt-0">
                      <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      {exam.totalQuestions} questions
                    </p>
                    <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto mt-2 sm:mt-0">
                      <Trophy className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      Passing score: {exam.passingScore}%
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Button
                      onClick={() =>
                        handleExamSave({
                          userId: userId,
                          examId: exam.id,
                          action: savedExams[exam.id] ? "delete" : "add",
                        })
                      }
                      className="h-8 w-8 hidden lg:flex"
                      variant={"outline"}
                      size={"icon"}
                    >
                      {savedExams[exam.id] ? (
                        <Bookmark size={18} className="fill-foreground" />
                      ) : (
                        <Bookmark size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
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
                  handleStartExam({
                    userId: userId,
                    examId: selectedExam.id,
                  })
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
    </div>
  );
};

export default ExamsList;
