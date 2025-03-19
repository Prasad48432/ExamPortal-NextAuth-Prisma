"use client";
import { ToastError } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { saveExam } from "@/lib/actions/examActions";
import type { Exam, SavedExam } from "@prisma/client";
import { Clock, Delete, FileText, Trash, Trophy } from "lucide-react";
import React, { useState } from "react";

type Exams = SavedExam & {
  exam: Exam;
};

const SavedExamList = ({
  exams,
  userId,
}: {
  exams: Exams[];
  userId: string;
}) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedExams, setSavedExams] = useState<Exams[]>(exams);

  const handleExamRemove = async ({
    userId,
    examId,
    savedExamId,
    action,
  }: {
    userId: string;
    examId: string;
    savedExamId: string;
    action: string;
  }) => {
    const response = await saveExam(userId, examId, action);

    if (response.success) {
      setSavedExams((prev) => prev.filter((exam) => exam.id !== savedExamId));
    } else {
      ToastError({ message: "Error removing exam" });
    }
  };

  const openModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {savedExams.map((exam) => (
        <div key={exam.id} className="col-span-1">
          <Card className="px-4 py-4 sm:px-6 border bg-card text-card-foreground">
            {/* Title & Start Exam Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium truncate text-primary">
                  {exam.exam.title}
                </h3>
                <p className="mt-1 text-sm text-card-foreground sm:truncate">
                  {exam.exam.description}
                </p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-2">
                <Button
                  onClick={() => openModal(exam.exam)}
                  className="inline-flex items-center h-8 px-3 w-full sm:w-auto"
                >
                  Start Exam
                </Button>
                <Button
                  onClick={() =>
                    handleExamRemove({
                      userId: userId,
                      examId: exam.exam.id,
                      savedExamId: exam.id,
                      action: "delete",
                    })
                  }
                  className="h-8 w-8 flex lg:hidden"
                  variant={"outline"}
                  size={"icon"}
                >
                  <Trash size={18} className="text-chart-fail" />
                </Button>
              </div>
            </div>

            {/* Exam Details & Delete Button */}
            <div className="mt-3 flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap sm:space-x-4">
                <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                  {exam.exam.duration} minutes
                </p>
                <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto mt-2 sm:mt-0">
                  <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                  {exam.exam.totalQuestions} questions
                </p>
                <p className="flex items-center text-sm text-card-foreground w-full sm:w-auto mt-2 sm:mt-0">
                  <Trophy className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary" />
                  Passing score: {exam.exam.passingScore}%
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button
                  onClick={() =>
                    handleExamRemove({
                      userId: userId,
                      examId: exam.exam.id,
                      savedExamId: exam.id,
                      action: "delete",
                    })
                  }
                  className="h-8 w-8 hidden lg:flex"
                  variant={"outline"}
                  size={"icon"}
                >
                  <Trash size={18} className="text-chart-fail" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SavedExamList;
