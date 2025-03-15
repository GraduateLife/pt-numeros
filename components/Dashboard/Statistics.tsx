import { cn, hm, isThisWeek, toWeekDay } from "@/lib/utils";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  value: number;
  date: string;
}

interface StatisticsPanelProps {
  className?: string;
  todayTasks: number;
  monthlyTasks: number;
  chartData: ChartData[];
}

export const Statistics = ({
  className,
  todayTasks,
  monthlyTasks,
  chartData,
}: StatisticsPanelProps) => {
  return (
    <div className={cn("flex flex-col p-4 ", className)}>
      <div className="mb-4 text-lg font-medium flex items-center justify-between">
        <span>你的统计</span>
        <span className="text-sm text-violet-500/80 hover:text-violet-500 cursor-pointer">
          我们如何统计你做了什么?
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Today's tasks */}
        <StaticCard title="今天你做了">
          <p className="self-end sm:self-start text-2xl sm:text-3xl font-bold">
            {todayTasks + " 件事"}
          </p>
        </StaticCard>
        <StaticCard title="本月你做了" variant="light">
          <p className="self-end sm:self-start text-2xl sm:text-3xl font-bold">
            {monthlyTasks + " 件事"}
          </p>
        </StaticCard>
        <StaticCard title="学习趋势" variant="light">
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.777 0.152 181.912)"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StaticCard>
      </div>
      <div className="flex-1">
        <WeeklyReport chartData={chartData} />
      </div>
    </div>
  );
};

const StaticCard = ({
  title,
  children,
  variant = "dark",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) => {
  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl",
        variant === "dark"
          ? "bg-black text-white"
          : "bg-gray-100 text-black border border-gray-200",
      )}
    >
      <div className="flex flex-col justify-between h-full">
        <p
          className={cn(
            "text-md font-medium sm:text-sm",
            variant === "dark" ? "text-white" : "text-black",
          )}
        >
          {title}
        </p>
        {children}
      </div>
    </div>
  );
};

type WeeklyReportProps = {
  chartData: { value: number; date: string }[];
  needReferenceLinesNumber?: number;
};

const WeeklyReport = ({
  chartData,
  needReferenceLinesNumber = 4,
}: WeeklyReportProps) => {
  // Calculate the maximum value from the data
  const maxValue = Math.max(...chartData.map((item) => item.value));
  // Round up to the nearest multiple of 20 to get a nice max value
  const roundedMax = Math.ceil(maxValue / 20) * 20;
  // Create an array of reference line values
  const referenceLines = Array.from(
    { length: needReferenceLinesNumber },
    (_, i) => Math.round((i + 1) * (roundedMax / needReferenceLinesNumber)),
  );

  // Create an array of all weekdays
  const allWeekDays = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  const currentWeekData = allWeekDays.map((day) => {
    const existingData = chartData
      .filter((item) => isThisWeek(item.date))
      .find((item) => {
        return toWeekDay(item.date) === day;
      });

    return {
      value: existingData?.value || 0,
      date: day,
    };
  });

  return (
    <div>
      <div className="h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentWeekData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={hm}
              dx={-10}
            />
            {/* Dynamic reference lines */}
            {referenceLines.map((value) => (
              <ReferenceLine
                key={value}
                y={value}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}

            <Line
              type="monotone"
              dataKey="value"
              stroke="oklch(0.702 0.183 293.541)"
              strokeWidth={2}
              dot={false}
              // fill="url(#colorGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
