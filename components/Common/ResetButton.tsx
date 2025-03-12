"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ResetButtonProps {
  inactiveText: string;
  holdingText: (remainingSeconds: number) => string;
  completedText: string;
  onReset: () => void;
  className?: string;
  duration?: number; // in milliseconds
  disabledTime?: number; // how long to disable after completion
}

export default function ResetButton({
  onReset,
  inactiveText,
  holdingText,
  completedText,
  className,
  duration = 3000, // default 3 seconds
  disabledTime = 1500, // default 1.5 seconds
}: ResetButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Start progress timer when button is pressed
  const startTimer = () => {
    // Don't start if disabled
    if (isDisabled) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset progress
    setProgress(0);

    // Set up interval to update progress
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);

      setProgress(newProgress);

      // Check if complete
      if (newProgress >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setIsComplete(true);
        setIsDisabled(true);

        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        onReset();

        // Reset after delay
        setTimeout(() => {
          setIsComplete(false);
          setProgress(0);

          // Re-enable after the disabled time
          setTimeout(() => {
            setIsDisabled(false);
          }, disabledTime - 1000); // Subtract the completion display time
        }, 1000);
      }
    }, 30); // Update frequently for smooth animation
  };

  // Stop progress timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isComplete) {
      setProgress(0);
    }
  };

  // Handle button press start
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsPressed(true);
    startTimer();
  };

  // Handle button press end
  const handlePressEnd = () => {
    if (isDisabled) return;

    setIsPressed(false);
    if (!isComplete) {
      stopTimer();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate remaining seconds
  const remainingSeconds = Math.ceil(
    (duration - (progress / 100) * duration) / 1000,
  );

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        variant="destructive"
        size="lg"
        disabled={isDisabled}
        className={cn(
          "relative overflow-hidden transition-all ",
          isDisabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
          isComplete ? "bg-green-600 hover:bg-green-600" : "",
          className,
        )}
        style={{
          // Use the default destructive color when not pressed
          backgroundColor:
            isPressed && !isComplete ? "hsl(var(--destructive))" : "",
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        aria-pressed={isPressed}
        aria-disabled={isDisabled}
      >
        {/* Progress bar - fills from left to right with darker color */}
        <div
          className={cn(
            "absolute inset-0 left-0 top-0 h-full origin-left z-0",
            isComplete ? "bg-green-500" : "bg-red-600", // Darker red for the progress bar
          )}
          style={{
            width: `${progress}%`,
          }}
        />

        {/* Button content */}
        <span className="flex items-center justify-center w-48 gap-2 z-10 relative">
          {isComplete ? (
            <CheckCircle className="text-green-300" />
          ) : (
            <AlertCircle />
          )}
          <span>
            {isComplete
              ? completedText
              : isDisabled
                ? inactiveText
                : isPressed
                  ? holdingText(remainingSeconds)
                  : inactiveText}
          </span>
        </span>

        {/* Percentage indicator */}
        {isPressed && !isComplete && (
          <span className="absolute bottom-1 right-2 text-xs font-medium text-white/80 z-10">
            {Math.round(progress)}%
          </span>
        )}
      </Button>
    </div>
  );
}
