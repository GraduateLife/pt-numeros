import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface LineProps {
  keygen: string;
  display: number[];
  className?: string;
  children: React.ReactNode[];
  itemClassName?: string;
  distrubuteByPart?: boolean;
}

export const DisplayLine = ({
  keygen,
  display,
  children,
  className,
  itemClassName,
  distrubuteByPart = false,
}: LineProps) => {
  return (
    <div className={cn(`w-full flex flex-col sm:flex-row`, className)}>
      {children.map((child, i) => (
        <div
          key={`${keygen}-${i}`}
          className={cn(
            "flex flex-col w-full  sm:h-full sm:w-[var(--part)]",
            distrubuteByPart ? "h-[var(--part)]" : "h-full",
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
