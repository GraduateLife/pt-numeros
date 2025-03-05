import { useEffect, useRef } from "react";
import { Input } from "../ui/input";

interface DigitInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
  maxLength?: number;
}

export function DigitInput({
  value,
  onChange,
  onComplete,
  maxLength = 3,
}: DigitInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, inputValue: string) => {
    // Create a new array with the current length
    const newValue = Array(maxLength).fill("");

    // Copy existing values from the current value
    value.split("").forEach((digit, i) => {
      if (i < maxLength) newValue[i] = digit;
    });

    // Update the new digit
    if (index < maxLength) {
      newValue[index] = inputValue.slice(-1);
    }

    // Join and trim to remove empty spaces at the end
    const updatedValue = newValue.join("");
    onChange(updatedValue);

    // Auto-focus next input if we have a value and not at the end
    if (inputValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      onComplete();
    } else if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: maxLength }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            if (el) {
              inputRefs.current[index] = el;
            }
          }}
          type="text"
          value={value[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="rounded-none w-16 h-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-center text-2xl border-t-0 border-l-0 border-r-0 border-b-2 border-gray-300 shadow-none focus:ring-0 bg-transparent focus:border-gray-500"
          maxLength={1}
        />
      ))}
    </div>
  );
}
