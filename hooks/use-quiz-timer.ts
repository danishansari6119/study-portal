// hooks/use-quiz-timer.ts
import { useState, useEffect, useCallback } from "react";

export function useQuizTimer(durationSeconds: number, onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(false);

  const start = useCallback(() => setRunning(true), []);
  const stop  = useCallback(() => setRunning(false), []);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { onExpire(); return; }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, timeLeft, onExpire]);

  return { timeLeft, running, start, stop };
}
