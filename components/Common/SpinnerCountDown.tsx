"use client";
import { useEffect, useReducer, useState } from "react";
import { motion, animate } from "framer-motion";

interface SpinnerCountdownProps {
  duration: number; // Countdown duration in seconds
  size?: number; // Spinner size
  strokeWidth?: number; // Circle stroke width
  onComplete: () => void; // Callback when countdown finishes
  reset?: boolean; // Reset the countdown
}

export const SpinnerCountdown: React.FC<SpinnerCountdownProps> = ({
  duration,
  size = 100,
  strokeWidth = 8,
  onComplete,
  reset = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reset) {
      setProgress(1);
    }
    if (isPaused) return;

    const controls = animate(1, 0, {
      duration,
      ease: "linear",
      onUpdate: (v) => {
        setProgress(v);
      },
      onComplete: () => onComplete(),
    });

    return () => controls.stop();
  }, [duration, isPaused]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Countdown Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="blue"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate from top
        />
      </svg>

      {/* Time Display */}
      <span className="absolute text-lg font-bold select-none">
        {(progress * duration).toFixed(1)}
      </span>

      {/* Pause/Resume Button */}
    </div>
  );
};

export default SpinnerCountdown;
