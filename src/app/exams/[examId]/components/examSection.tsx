"use client";
import { Exam, ExamResult, Question } from "@prisma/client";
import {
  AlertCircle,
  ChevronRight,
  CircleCheck,
  Clock,
  Maximize,
  Minimize,
  Settings,
  WifiHigh,
} from "lucide-react";
import React, { act, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useFullScreen } from "@/hooks/useFullScreen";
import {
  submitExamResult,
  validateSecurityCheck,
} from "@/lib/actions/examActions";
import { useRouter } from "next/navigation";
import useCountdown from "@/hooks/useCountdown";
import { ToastError } from "@/components/toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

const ExamSection = ({
  lockQuestions,
  examDetails,
  attempt,
  userEmail,
}: {
  lockQuestions: Question[];
  examDetails: Exam;
  attempt: ExamResult;
  userEmail: string;
}) => {
  const [questions, setQuestions] = useState<Question[]>(lockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const submittedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const { exitFullScreen, isFullScreen, enterFullScreen } = useFullScreen();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showTimerExpiryToast = () => {
    ToastError({ message: "Last 30 seconds left, hurry up!" });
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    setSubmitting(true);

    try {
      const correctAnswers = questions.filter(
        (q) => answers[q.id] === q.correctAnswer
      ).length;

      const score = Math.round((correctAnswers / questions.length) * 100);
      const formattedAnswers = questions.map((question) => ({
        question_id: question.id,
        selected_option: answers[question.id] ?? -1,
        is_correct: answers[question.id] === question.correctAnswer,
      }));

      const result = await submitExamResult(
        attempt.id,
        score,
        formattedAnswers
      );
      if (!result.success) throw new Error("error submitting");

      if (isFullScreen) {
        await exitFullScreen();
      }

      router.push(`/results/${result.attemptId}`);
    } catch (err) {
      console.error("Error submitting exam:", err);
      setSubmitting(false);
    }
  };

  const { secondsLeft, start } = useCountdown(
    handleSubmit,
    showTimerExpiryToast
  );

  useEffect(() => {
    if (attempt.securityCheck === true && attempt.startedAt) {
      const startTime = new Date(attempt.startedAt).getTime();
      const totalDuration = examDetails.duration * 60 * 1000; // Convert to ms
      const endTime = startTime + totalDuration;
      start(Math.max((endTime - Date.now()) / 1000, 0));
    }
  }, []);

  const activateFullScreen = async (isFullScreen: boolean) => {
    if (!isFullScreen) {
      await enterFullScreen();
    }
  };

  const deactivateFullScreen = async (isFullScreen: boolean) => {
    if (isFullScreen) {
      await exitFullScreen();
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleSecurityCheck = async () => {
    const result = await validateSecurityCheck(attempt.id);

    if (result.success) {
      activateFullScreen(isFullScreen);
      const startTime = new Date(
        result.attempt?.startedAt || new Date()
      ).getTime();
      const totalDuration = examDetails.duration * 60 * 1000;
      const endTime = startTime + totalDuration;
      start(Math.max((endTime - Date.now()) / 1000, 0));
      router.refresh();
    }
  };

  if (attempt.securityCheck === false) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-4 items-center justify-end flex-col">
            <h1 className="text-xl font-bold">Security Check</h1>
            <p className="text-lg font-semibold">{examDetails.title}</p>
            <p className="text-base">
              complete this exam in {examDetails.duration}minutes
            </p>
            <Button
              onClick={() => {
                handleSecurityCheck();
              }}
              className="h-8"
            >
              Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isFullScreen && !submitting) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-4 items-center justify-end flex-col">
            <h1 className="text-4xl font-bold">Please switch to full screen</h1>
            <Button
              onClick={() => activateFullScreen(isFullScreen)}
              variant={"secondary"}
            >
              Enter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 transform z-40">
        <div className="absolute inset-0 h-full w-full bg-lightprimary-bg/70 dark:bg-primary-bg/90 !opacity-100 transition-opacity"></div>
        <nav className="border-b relative z-40 border-lightsecondary-border dark:border-secondary-border backdrop-blur-sm transition-opacity dark:shadow-lg dark:shadow-primary-bg/80">
          <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
            <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
              <div className="flex items-center divide-x gap-2">
                <div className="flex items-center justify-start">
                  <p className="font-bold leading-tight">
                    Exam <br /> Portal
                  </p>
                </div>
                <div className="flex flex-col items-start justify-center pl-2">
                  <p className="font-semibold text-sm text-foreground/90">
                    {userEmail}
                  </p>
                  <p className="font-medium text-xs flex items-center justify-center text-foreground/80">
                    {examDetails.title} /{" "}
                    <CircleCheck
                      className="ml-1 mr-1"
                      color="#16a34a"
                      size={15}
                    />{" "}
                    <span className="text-green-600">
                      Saved: 30 seconds ago
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-10 items-center justify-end">
                <div className="flex items-center text-sm font-medium text-foreground/80">
                  <Clock className="h-4 w-4 mr-1" />
                  Time left:{" "}
                  {secondsLeft !== null
                    ? formatTime(secondsLeft)
                    : "Loading..."}
                </div>
                <div className="flex gap-2 items-center text-sm font-medium">
                  {isFullScreen && (
                    <Minimize
                      onClick={() => {
                        deactivateFullScreen(isFullScreen);
                      }}
                      className="h-4 w-4 mr-1 cursor-pointer"
                    />
                  )}
                  {!isFullScreen && (
                    <Maximize
                      onClick={() => {
                        activateFullScreen(isFullScreen);
                      }}
                      className="h-4 w-4 mr-1 cursor-pointer"
                    />
                  )}
                  <Settings
                    className="h-4 w-4 mr-1 cursor-pointer"
                    strokeWidth={1.5}
                  />
                </div>
                <Button
                  onClick={() => {
                    openModal();
                  }}
                  className="h-8"
                >
                  {submitting ? (
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
                      Submitting...
                    </>
                  ) : (
                    "Sumbit Test"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Exam Section */}
          <div className="flex-1 min-h-[calc(100vh-210px)]">
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row items-center justify-center mb-12 gap-2">
                <div className="w-full flex flex-col">
                  <h4 className="text-lg font-medium mb-4 select-none">
                    {currentQuestion.questionText}
                  </h4>
                  {currentQuestion.questionImage && (
                    <img
                      className="my-4 w-[60%] object-cover"
                      src={currentQuestion.questionImage}
                    />
                  )}
                  <div className="space-y-3 select-none">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={`option-${index}`}
                          name={`question-${currentQuestion.id}`}
                          type="radio"
                          className="focus:ring-primary/80 h-4 w-4 text-primary"
                          checked={answers[currentQuestion.id] === index}
                          onChange={() =>
                            handleAnswerSelect(currentQuestion.id, index)
                          }
                        />
                        <label
                          htmlFor={`option-${index}`}
                          className="ml-3 block text-sm font-medium text-foreground/80"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between select-none">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`select-none inline-flex h-8 items-center px-4 py-2 border text-xs font-medium rounded-md ${
                    currentQuestionIndex === 0
                      ? "bg-muted/40 text-foreground/50 cursor-not-allowed"
                      : "bg-muted/90 text-foreground hover:bg-muted"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  Previous
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="select-none inline-flex h-8 items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
                  >
                    Next <ChevronRight size={15} />
                  </Button>
                ) : (
                  <Button
                    disabled={submitting}
                    onClick={() => {
                      openModal();
                    }}
                    className="select-none inline-flex h-8 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
                  >
                    {submitting ? (
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
                        Submitting...
                      </>
                    ) : (
                      "Sumbit Test"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="relative lg:sticky top-10 lg:top-20 flex flex-col items-start justify-center">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-sm font-medium mb-4">Question Navigator</h4>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`h-12 w-12 flex items-center justify-center text-sm font-medium rounded-md ${
                        index === currentQuestionIndex
                          ? "bg-primary/80 text-primary-foreground"
                          : answers[questions[index].id] !== undefined
                          ? "bg-green-200 dark:bg-green-400 text-green-800 dark:text-green-900 border border-green-300 dark:border-green-500"
                          : "bg-muted/80 text-foreground hover:bg-muted"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-3 justify-start text-sm text-foreground/70">
                  <div className="flex items-center text-sm">
                    <div className="h-3 w-3 bg-green-200 border border-green-300 rounded-sm mr-1"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="h-3 w-3 bg-muted/80 text-foreground hover:bg-muted border rounded-sm mr-1"></div>
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="h-3 w-3 bg-primary/80 border border-primary rounded-sm mr-1"></div>
                    <span>Current</span>
                  </div>
                </div>
              </div>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogOverlay className="bg-muted/40" />
              <DialogContent className="gap-1">
                <DialogHeader>
                  <DialogTitle>Confirm Submit</DialogTitle>
                </DialogHeader>
                <p className="text-sm mb-4">Review your info</p>
                <div className="border-l-4 border-yellow-400 py-2 px-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 dark:text-yellow-400 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium dark:text-yellow-500 text-yellow-800">
                        You still have{" "}
                        <span className="bg-muted p-1 rounded-md text-foreground">
                          {" "}
                          {secondsLeft !== null
                            ? formatTime(secondsLeft)
                            : "Loading..."}
                        </span>{" "}
                        minutes left
                      </h3>
                      <div className="mt-2 text-sm dark:text-yellow-400 text-yellow-700">
                        <ul className="list-disc pl-1 space-y-1">
                          <li>
                            Answered questions: {Object.keys(answers).length}
                          </li>
                          <li>
                            Unanswered questions:{" "}
                            {Object.keys(questions).length -
                              Object.keys(answers).length}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={submitting}
                    className="h-8 px-3"
                    variant="secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-8 px-3"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
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
                        Submitting...
                      </>
                    ) : (
                      "Sumbit"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 transform z-40">
        <div className="absolute inset-0 h-full w-full !opacity-100 transition-opacity"></div>
        <nav className="border-t relative z-40 backdrop-blur-sm transition-opacity dark:shadow-lg dark:shadow-primary-bg/80">
          <div className="relative flex justify-between h-12 mx-auto lg:container lg:px-16 xl:px-20">
            <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
              <div className="flex items-center justify-center gap-3 relative">
                {/* WiFi Icon */}
                <WifiHigh color="green" className="relative z-10 mb-1.5" />

                {/* Ping Animation */}
                <div className="relative w-2 h-2 flex items-center justify-center">
                  <span className="absolute top-0 left-0 w-full h-full bg-green-600 dark:bg-green-500 rounded-full"></span>
                  <span className="absolute top-0 left-0 w-full h-full bg-green-600 dark:bg-green-500 rounded-full opacity-75 animate-ping"></span>
                </div>

                <p className="text-center text-xs text-foreground/60">
                  © {new Date().getFullYear()} ExamPortal. All rights reserved.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 relativ">
              <p className="text-xs">Need help? Contact us:</p>
              <p className="text-xs flex items-center justify-center gap-1">
                {" "}
                <Image
                  src={`https://flagsapi.com/IN/flat/64.png`}
                  height={50}
                  width={50}
                  alt={"india"}
                  className="h-5 w-5 object-cover mr-0.5"
                />{" "}
                +91 8074414860
              </p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default ExamSection;
