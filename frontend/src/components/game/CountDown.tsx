'use client';

import { useState, useEffect } from 'react';

interface CountDownProps {
  initialTime: number;
  isTimerRunning: boolean;
  onTimeUp: () => void;
}

export default function CountDown({ initialTime, isTimerRunning, onTimeUp }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center p-2 bg-secondary rounded-md shadow-md">
      <span className={`text-2xl font-mono font-bold ${timeLeft <= 30 ? 'text-red-500' : 'text-primary'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};


