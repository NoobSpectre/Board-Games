"use client";

import { useEffect, useRef, useState } from "react";

type UseCountDownProps = {
  timeOut: number; // in seconds
};

export function useCountDown({ timeOut }: UseCountDownProps) {
  const [shouldCountDown, setShouldCountDown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeOut);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startCountDown = (props?: { delay: number }) =>
    props?.delay
      ? setTimeout(() => setShouldCountDown(true), props.delay)
      : setShouldCountDown(true);

  const stopCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShouldCountDown(false);
  };

  const resetCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setShouldCountDown(false);
    setTimeLeft(timeOut);
  };

  useEffect(() => {
    if (!shouldCountDown) return;

    if (timeLeft <= 0) return stopCountDown();

    intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);

    return () => clearInterval(intervalRef.current);
  }, [shouldCountDown, timeLeft]);

  return { timeLeft, startCountDown, resetCountDown };
}
