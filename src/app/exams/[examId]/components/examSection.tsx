"use client";
import { Exam, ExamResult, Question } from "@prisma/client";
import {
  CircleCheck,
  Clock,
  Fullscreen,
  Minimize,
  Settings,
  Wifi,
  WifiHigh,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import NetworkSpeed from "./wifispeed";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ExamSection = ({
  lockQuestions,
  examDetails,
  attempt,
}: {
  lockQuestions: Question[];
  examDetails: Exam;
  attempt: ExamResult;
}) => {
  const [questions, setQuestions] = useState<Question[]>(lockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const startTime = new Date(attempt.createdAt).getTime();
    const totalDuration = examDetails.duration * 60 * 1000; // Convert to ms
    const endTime = startTime + totalDuration;
    setTimeLeft(Math.max((endTime - Date.now()) / 1000, 0));
  }, []);

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

  return (
    // <div>
    //   <div className="overflow-hidden min-h-screen">
    //     <div className="px-4 py-5 sm:px-6 flex justify-between items-center sticky top-0 transform z-40">
    //       <div>
    //         <h3 className="leading-6 font-medium">
    //           {examDetails.title}
    //         </h3>
    //         <p className=" max-w-2xl text-sm">
    //           Question {currentQuestionIndex + 1} of {questions.length}
    //         </p>
    //       </div>
    //       <div className="flex items-center text-sm font-medium">
    //         <Clock className="h-5 w-5 mr-1" />
    //         Time left: {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
    //       </div>
    //     </div>
    //     <div className="flex flex-col lg:flex-row gap-4 divide-x h-full items-center justify-center">
    //       <div className="px-4 py-5 sm:p-6 select-none w-full lg:w-3/4 h-full min-h-[120vh]">
    //   <div className="flex flex-col lg:flex-row items-center justify-center mb-6 gap-2">
    //     <div className="w-full flex flex-col">
    //       <h4 className="text-lg font-medium mb-4 select-none">
    //         {currentQuestion.questionText}
    //       </h4>
    //       <div className="space-y-3 select-none">
    //         {currentQuestion.options.map((option, index) => (
    //           <div key={index} className="flex items-center">
    //             <input
    //               id={`option-${index}`}
    //               name={`question-${currentQuestion.id}`}
    //               type="radio"
    //               className="focus:ring-primary/80 h-4 w-4 text-primary"
    //               checked={answers[currentQuestion.id] === index}
    //               onChange={() =>
    //                 handleAnswerSelect(currentQuestion.id, index)
    //               }
    //             />
    //             <label
    //               htmlFor={`option-${index}`}
    //               className="ml-3 block text-sm font-medium text-foreground/80"
    //             >
    //               {option}
    //             </label>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex justify-between select-none">
    //     <button
    //       onClick={handlePrevious}
    //       disabled={currentQuestionIndex === 0}
    //       className={`select-none inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
    //         currentQuestionIndex === 0
    //           ? "bg-muted/40 text-foreground/50 cursor-not-allowed"
    //           : "bg-muted/90 text-foreground hover:bg-muted"
    //       } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
    //     >
    //       Previous
    //     </button>
    //     {currentQuestionIndex < questions.length - 1 ? (
    //       <button
    //         onClick={handleNext}
    //         className="select-none inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
    //       >
    //         Next
    //       </button>
    //     ) : (
    //       <button
    //         onClick={() => {}}
    //         className="select-none inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
    //       >
    //         Submit Exam
    //       </button>
    //     )}
    //   </div>
    // </div>
    //       <div className="mt-6 overflow-hidden select-none w-full lg:w-1/4 h-[80vh]">
    // <div className="px-4 py-5 sm:p-6">
    //   <h4 className="text-sm font-medium mb-4">
    //     Question Navigator
    //   </h4>
    //   <div className="flex flex-wrap gap-3">
    //     {questions.map((_, index) => (
    //       <button
    //         key={index}
    //         onClick={() => setCurrentQuestionIndex(index)}
    //         className={`h-12 w-12 flex items-center justify-center text-sm font-medium rounded-md ${
    //           index === currentQuestionIndex
    //             ? "bg-primary/80 text-primary-foreground"
    //             : answers[questions[index].id] !== undefined
    //             ? "bg-green-200 text-green-800 border border-green-300"
    //             : "bg-muted/80 text-foreground hover:bg-muted"
    //         }`}
    //       >
    //         {index + 1}
    //       </button>
    //     ))}
    //   </div>
    //   <div className="mt-4 flex gap-3 justify-start text-sm text-foreground/70">
    //     <div className="flex items-center text-sm">
    //       <div className="h-3 w-3 bg-green-200 border border-green-300 rounded-sm mr-1"></div>
    //       <span>Answered</span>
    //     </div>
    //     <div className="flex items-center text-sm">
    //       <div className="h-3 w-3 bg-muted/80 text-foreground hover:bg-muted border rounded-sm mr-1"></div>
    //       <span>Unanswered</span>
    //     </div>
    //     <div className="flex items-center text-sm">
    //       <div className="h-3 w-3 bg-primary/80 border border-primary rounded-sm mr-1"></div>
    //       <span>Current</span>
    //     </div>
    //   </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-lightprimary-bg dark:bg-primary-bg">
      <div className="sticky top-0 transform z-40 bg-lightprimary-bg dark:bg-primary-bg/90">
        <div className="absolute inset-0 h-full w-full bg-lightprimary-bg/70 dark:bg-primary-bg/90 !opacity-100 transition-opacity"></div>
        <nav className="border-b relative z-40 border-lightsecondary-border dark:border-secondary-border backdrop-blur-sm transition-opacity dark:shadow-lg dark:shadow-primary-bg/80">
          <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
            <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
              <div className="flex items-center divide-x gap-2">
                <div className="flex items-center justify-start">
                  <p className="font-bold">Exam Portal</p>
                </div>
                <div className="flex flex-col items-start justify-center pl-2">
                  <p className="font-semibold text-sm">Prasad Reddy</p>
                  <p className="font-medium text-xs flex items-center justify-center">
                    Web Dev Exam /{" "}
                    <CircleCheck
                      className="ml-1 mr-1"
                      color="green"
                      size={15}
                    />{" "}
                    Saved: 30 seconds ago
                  </p>
                </div>
              </div>
              <div className="flex gap-10 items-center justify-end">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  Time left:{" "}
                  {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
                </div>
                <div className="flex gap-2 items-center text-sm font-medium">
                  <Minimize className="h-4 w-4 mr-1 cursor-pointer" />
                  <Settings
                    className="h-4 w-4 mr-1 cursor-pointer"
                    strokeWidth={1.5}
                  />
                </div>
                <Button className="h-8">Finish Test</Button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-lightprimary-bg dark:bg-primary-bg">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Exam Section */}
          <div className="flex-1 min-h-[calc(100vh-210px)]">
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row items-center justify-center mb-6 gap-2">
                <div className="w-full flex flex-col">
                  <h4 className="text-lg font-medium mb-4 select-none">
                    {currentQuestion.questionText}
                  </h4>
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
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`select-none inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    currentQuestionIndex === 0
                      ? "bg-muted/40 text-foreground/50 cursor-not-allowed"
                      : "bg-muted/90 text-foreground hover:bg-muted"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="select-none inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {}}
                    className="select-none inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary/80 hover:bg-primary"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="relative lg:sticky top-10 lg:top-20 flex flex-col items-start justify-center">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-sm font-medium mb-4">Question Navigator</h4>
                <div className="flex flex-wrap gap-3">
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
              <p className="text-xs">Need help? Contact us</p>
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
