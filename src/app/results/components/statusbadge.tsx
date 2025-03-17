import React from "react";

interface ExamStatusBadgeProps {
  score: number;
  passingScore?: number;
}

const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ score, passingScore = 70 }) => {
  const hasPassed = score >= passingScore;
  
  return (
    <span
      className={`px-3 py-0.5 inline-flex text-sm leading-5 font-semibold rounded-full 
        ${hasPassed 
          ? "bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-500 text-green-700 dark:text-foreground" 
          : "bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-500 text-red-700 dark:text-foreground"
        }`}
    >
      {hasPassed ? "Passed" : "Failed"}
    </span>
  );
};

export default ExamStatusBadge;
