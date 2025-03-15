import { cn, toWeekDay } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TodoIsland } from "./TodoIsland";
interface BomDiaProps {
  name?: string;
  className?: string;
}

interface TimeBasedStyle {
  greeting: string;
  bgColor: string;
  timeColor: string;
}

const getTimeBasedStyle = (hours: number): TimeBasedStyle => {
  if (hours >= 5 && hours < 12) {
    return {
      greeting: "Bom dia",
      bgColor: "bg-gradient-to-r from-blue-100 to-cyan-100", // Dark warm text for morning
      timeColor: "text-orange-400", // Slightly lighter for time display
    };
  } else if (hours >= 12 && hours < 18) {
    return {
      greeting: "Boa tarde",
      bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
      timeColor: "text-blue-400", // Slightly lighter for time display
    };
  } else {
    return {
      greeting: "Boa noite",
      bgColor: "bg-gradient-to-r from-indigo-100 to-purple-100", // Dark purple text for night
      timeColor: "text-indigo-800", // Slightly lighter for time display
    };
  }
};

export const BomDia = ({ name, className }: BomDiaProps) => {
  const now = new Date();
  const { greeting, bgColor, timeColor } = getTimeBasedStyle(now.getHours());
  const time = format(now, "HH:mm");
  const dayOfWeek = toWeekDay(now.toISOString()).toUpperCase();

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-sm h-[var(--panel-first-line-shrink-height)]",
        bgColor,
        className,
      )}
    >
      <div className="flex flex-col justify-between items-start h-full space-y-2">
        <span className={cn("text-2xl font-medium", timeColor)}>
          {greeting}
          {name ? `, ${name}` : ""}.
        </span>
        <span className={cn("text-2xl font-medium", timeColor)}>
          {`Hoje é ${format(now, "dd 'de' MMMM 'de' yyyy,", { locale: ptBR })}`}
        </span>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-6xl font-medium", timeColor)}>{time}</span>
          <span className={cn("text-6xl font-medium", timeColor)}>
            {dayOfWeek}
          </span>
        </div>

        <div className="w-full flex-1 z-50 flex items-center justify-center">
          <TodoIsland />
        </div>
      </div>
    </div>
  );
};
