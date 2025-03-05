"use client";
import { formatDuration, intervalToDuration } from "date-fns";
import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SpinnerCountdownProps {
  duration: number; // Countdown duration in seconds
  size?: number; // Spinner size
  strokeWidth?: number; // Circle stroke width
  onComplete: () => void; // Callback when countdown finishes
}

export const SpinnerCountdown: React.FC<SpinnerCountdownProps> = ({
  duration,
  size = 100,
  strokeWidth = 8,
  onComplete,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const controls = animate(1, 0, {
      duration,
      ease: "linear",
      onUpdate: (v) => {
        setProgress(v);
      },
      onComplete,
    });

    return () => controls.stop();
  }, [duration, onComplete]);

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
        {duration > 60
          ? formatDuration(
              intervalToDuration({
                start: 0,
                end: Math.round(progress * duration) * 1000,
              }),
              { format: ["minutes", "seconds"], zero: true, delimiter: ":" },
            )
              .replace(/ minutes?/g, "")
              .replace(/ seconds?/g, "")
              .replace(/\s/g, ":")
              .replace(/^(\d+)$/, "$1:00") // Add :00 if only minutes are shown
              .replace(/:(\d)$/, ":0$1") // Add leading zero to single-digit seconds
          : (progress * duration).toFixed(1)}
      </span>

      {/* Pause/Resume Button */}
    </div>
  );
};

export default SpinnerCountdown;
