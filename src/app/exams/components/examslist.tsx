"use client";
import { AlertCircle, Clock, FileText, TrendingUp, Users } from "lucide-react";
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
import { Exam } from "@prisma/client";
import { startExam } from "@/lib/questionActions";
import { ToastError } from "@/components/toast";
import { useFullScreen } from "@/hooks/useFullScreen";
import { redirect } from "next/navigation";

const ExamsList = ({ exams, userId }: { exams: Exam[]; userId: string }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enterFullScreen } = useFullScreen();

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
    const response = await startExam(userId, examId);

    if (response.success) {
      await enterFullScreen();
      redirect(`/exams/${examId}?attemptId=${response.examResult?.id}`);
    } else {
      ToastError({ message: response.message || "error" });
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium truncate text-primary">
                      {exam.title}
                    </h3>
                    <p className="mt-1 text-sm text-card-foreground">
                      {exam.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Button
                      onClick={() => openModal(exam)}
                      className="inline-flex items-center"
                    >
                      Start Exam
                    </Button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex sm:space-x-4">
                    <p className="flex items-center text-sm text-card-foreground">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      {exam.duration} minutes
                    </p>
                    <p className="mt-2 flex items-center text-sm text-card-foreground sm:mt-0">
                      <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      {exam.totalQuestions} questions
                    </p>
                    <p className="mt-2 flex items-center text-sm text-card-foreground sm:mt-0">
                      <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                      Passing score: {exam.passingScore}%
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      {selectedExam && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="bg-gray-400/30" />
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
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleStartExam({ userId: userId, examId: selectedExam.id })
                }
              >
                Start
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExamsList;
