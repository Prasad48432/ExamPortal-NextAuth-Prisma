import { useState, useEffect, useRef } from "react";

export default function useCountdown(onExpire?: () => void, onLast30Sec?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const endTimeRef = useRef<number | null>(null);
  const last30SecTriggered = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0 || !endTimeRef.current) return;

    const interval = setInterval(() => {
      const remainingTime = Math.max((endTimeRef.current! - Date.now()) / 1000, 0);
      setSecondsLeft(remainingTime);

      if (remainingTime <= 30 && !last30SecTriggered.current) {
        last30SecTriggered.current = true;
        if (onLast30Sec) onLast30Sec();
      }

      if (remainingTime <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire, onLast30Sec]);

  function start(seconds: number) {
    const endTime = Date.now() + seconds * 1000;
    endTimeRef.current = endTime;
    setSecondsLeft(seconds);
    last30SecTriggered.current = false;
  }

  return { secondsLeft, start };
}
