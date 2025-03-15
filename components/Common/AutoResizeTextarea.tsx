"use client";

import { cn } from "@/lib/utils";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface AutoResizeTextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
}

function AutoResizeTextarea({
  className,
  value,
  onChange,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  return (
    <textarea
      {...props}
      value={value}
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        onChange(e.target.value);
        resizeTextarea();
      }}
      className={cn("resize-none min-h-4 max-h-80", className)}
    />
  );
}

export const AutoResizeTextareaForm = ({
  placeholder,
  emitSubmit,
  submitButtonText = "Submit",
  submitButtonIcon = <ArrowUpIcon size={16} />,
  isLoading = false,
}: {
  placeholder: string;
  emitSubmit: (value: string) => void;
  submitButtonText?: string;
  submitButtonIcon?: React.ReactNode;
  isLoading?: boolean;
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return; // Don't submit empty input
    emitSubmit(input);
    // Here you can add your logic to handle the submitted text
    setInput(""); // Clear input after submission
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-1 border-input bg-background focus-within:ring-ring/10 relative flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
    >
      <AutoResizeTextarea
        onKeyDown={handleKeyDown}
        onChange={(v) => setInput(v)}
        value={input}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 size-6 rounded-full"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                submitButtonIcon
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>{submitButtonText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  );
};
