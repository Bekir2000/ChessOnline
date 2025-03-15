import React, { useState, useEffect } from 'react';

interface CountDownProps {
  initialTime: number; // Time in seconds
  onTimeUp?: () => void;
}

const CountDown = ({ initialTime, onTimeUp }: CountDownProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

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

export default CountDown;
