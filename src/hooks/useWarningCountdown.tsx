import { useState, useEffect, useRef } from "react";

export default function useWarningCountdown(
  onExpire?: () => void,
  isFullScreen?: boolean
) {
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFullScreen) {
      setWarningSecondsLeft(0); // Reset timer when fullscreen is active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (warningSecondsLeft <= 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setWarningSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          if (onExpire) onExpire(); // Submit if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFullScreen, warningSecondsLeft, onExpire]);

  function warningStart(seconds: number) {
    if (!isFullScreen) {
      setWarningSecondsLeft(seconds);
    }
  }

  return { warningSecondsLeft, warningStart };
}
