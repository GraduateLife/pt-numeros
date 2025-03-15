import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface LineProps {
  keygen: string;
  display: number[];
  className?: string;
  children: React.ReactNode[];
  itemClassName?: string;
}

export const DisplayLine = ({
  keygen,
  display,
  children,
  className,
  itemClassName,
}: LineProps) => {
  return (
    <div className={cn(`w-full flex flex-col sm:flex-row`, className)}>
      {children.map((child, i) => (
        <div
          key={`${keygen}-${i}`}
          className={cn(
            "flex flex-col w-full h-[var(--part)] sm:h-full sm:w-[var(--part)]",
            itemClassName,
          )}
          style={
            {
              "--part": `${display[i] * 100}%`,
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
};
