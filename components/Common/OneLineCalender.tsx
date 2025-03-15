import React, { useEffect, useState } from "react";

interface OneLineCalenderProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  numberOfDays?: number;
}

export const OneLineCalender: React.FC<OneLineCalenderProps> = ({
  onDateSelect,
  selectedDate = new Date(),
  numberOfDays = 7,
}) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dateArray: Date[] = [];

      for (let i = 0; i < numberOfDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateArray.push(date);
      }

      setDates(dateArray);
    };

    generateDates();
  }, [numberOfDays]);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <div className="flex overflow-x-auto py-4 scrollbar-hide">
      {dates.map((date, index) => (
        <div
          key={index}
          onClick={() => onDateSelect?.(date)}
          className={`flex flex-col items-center min-w-[60px] p-2 cursor-pointer rounded-lg mx-1 transition-colors
            ${
              isSameDate(date, selectedDate)
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "hover:bg-gray-100"
            }`}
        >
          <span className="text-xs mb-1">{getDayName(date)}</span>
          <span className="text-base font-semibold">{date.getDate()}</span>
        </div>
      ))}
    </div>
  );
};

export default OneLineCalender;
