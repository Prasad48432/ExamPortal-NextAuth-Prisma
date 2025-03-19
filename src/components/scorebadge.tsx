
import React from "react";

interface ScoreBadgeProps {
  score: number;
  passed: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, passed }) => {
  const getBadgeClasses = () => {
    if (passed) {
      return "bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-500 text-green-700 dark:text-foreground";
    // } else if (score >= 50) {
    //   return "bg-yellow-100 dark:bg-yellow-800 border border-yellow-300 dark:border-yellow-500 text-yellow-700 dark:text-foreground";
    } else {
      return "bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-500 text-red-700 dark:text-foreground";
    }
  };

  return (
    <span className={`px-3 py-0.5 inline-flex text-xs lg:text-sm leading-5 font-semibold rounded-full ${getBadgeClasses()}`}>
      {score}%
    </span>
  );
};

export default ScoreBadge;
