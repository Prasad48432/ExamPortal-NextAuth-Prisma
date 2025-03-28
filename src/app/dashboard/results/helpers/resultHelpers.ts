export function getExamFeedback(duration: number, timeSpent: number): string {
  const totalTimeSeconds = duration * 60; // Convert minutes to seconds
  const timePercentage = (timeSpent / totalTimeSeconds) * 100;

  if (timePercentage <= 20) {
    return "Too quick! Consider spending more time reviewing your answers.";
  } else if (timePercentage <= 50) {
    return "Average pace! You balanced speed and accuracy well.";
  } else if (timePercentage <= 80) {
    return "Conservative approach! You took time, which is good.";
  } else {
    return "Too slow! This might indicate overthinking or difficulty.";
  }
}

export function getQuestionFeedback(
  duration: number,
  timeSpent: number
): string {
  const totalTimeSeconds = duration * 60; // Convert minutes to seconds
  const timePercentage = (timeSpent / totalTimeSeconds) * 100;

  if (timePercentage <= 20) {
    return "Too quick! Consider spending more time on each question.";
  } else if (timePercentage <= 50) {
    return "Average pace! Ensure you're giving enough attention to each question.";
  } else if (timePercentage <= 80) {
    return "Conservative approach! You took time, which helps in accuracy.";
  } else {
    return "Too slow! Try to manage time better and avoid overthinking each question.";
  }
}

export function getFeedbackColor(duration: number, timeSpent: number): string {
  const totalTimeSeconds = duration * 60; // Convert minutes to seconds
  const timePercentage = (timeSpent / totalTimeSeconds) * 100;

  if (timePercentage <= 20) {
    return "text-chart-fail";
  } else if (timePercentage <= 50) {
    return "text-yellow-600 dark:text-yellow-500";
  } else if (timePercentage <= 80) {
    return "text-yellow-600 dark:text-yellow-500";
  } else {
    return "text-chart-success";
  }
}

export function getAccuracyColor(percent: number): string {
  if (percent <= 50) {
    return "text-chart-fail"; // 0% - 50%
  } else if (percent > 50 && percent <= 75) {
    return "text-chart-warning"; // 51% - 75%
  } else {
    return "text-chart-success"; // 76% and above
  }
}

export function getAccuracyHsl(percent: number): string {
  if (percent <= 50) {
    return "hsl(var(--chart-fail))"; // 0% - 50%
  } else if (percent > 50 && percent <= 75) {
    return "hsl(var(--chart-warning))"; // 51% - 75%
  } else {
    return "hsl(var(--chart-success))"; // 76% and above
  }
}



