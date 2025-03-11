import { cn } from "@/lib/utils";
import React from "react";

interface DragWrapperProps {
  children: React.ReactNode;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  className?: string;
  hoverClassName: string;
}

export const DragWrapper = ({
  children,
  onDragOver,
  onDragLeave,
  onDrop,
  hoverClassName,
}: DragWrapperProps) => {
  return (
    <div
      className={cn("relative")}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add(...hoverClassName.split(" "));
        onDragOver?.(e);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove(...hoverClassName.split(" "));
        onDragLeave?.(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove(...hoverClassName.split(" "));
        onDrop?.(e);
      }}
    >
      {children}
    </div>
  );
};
