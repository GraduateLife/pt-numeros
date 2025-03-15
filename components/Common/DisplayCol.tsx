import { cn } from "@/lib/utils";

interface ColProps {
  keygen: string;
  display: number[];
  className?: string;
  children: React.ReactNode[];
  itemClassName?: string;
}

export const DisplayCol = ({
  keygen,
  display,
  children,
  className,
  itemClassName,
}: ColProps) => {
  return (
    <div className={cn(`h-full flex flex-col`, className)}>
      {children.map((child, i) => (
        <div
          key={`${keygen}-${i}`}
          style={{ height: `${display[i] * 100}%` }}
          className={itemClassName}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
