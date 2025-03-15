// Dummy dashboard component with content

import { DisplayLine } from "../Common/DisplayRow";
import { SkipSSR } from "../Common/SkipSSR";
import { BomDia } from "./BomDia";
import { GameList } from "./LetsPlay";
import { Statistics } from "./Statistics";

const sampleData = [
  { date: "2025-03-04", value: 10 },
  { date: "2025-03-05", value: 20 },
  { date: "2025-03-06", value: 15 },
  { date: "2025-03-07", value: 50 },
  { date: "2025-03-08", value: 30 },
  { date: "2025-03-09", value: 0 },
  { date: "2025-03-10", value: 10 },
  { date: "2025-03-11", value: 20 },

  { date: "2025-03-14", value: 90 },
  { date: "2025-03-15", value: 0 },
  { date: "2025-03-16", value: 0 },
  { date: "2025-03-17", value: 0 },
];
export const Panel = () => {
  return (
    <div className="flex flex-1">
      <div className="px-3 py-1 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          <div className="h-[5vh] w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse">
            <VeryTop />
          </div>
        </div>
        <DisplayLine
          className="gap-2 min-h-[20vh]"
          keygen="top"
          display={[1 / 2, 1 / 4]}
          itemClassName="rounded-lg bg-gray-100 dark:bg-neutral-800"
        >
          {[
            <BomDia key="bom-dia" />,
            <SkipSSR key="game-list">
              <GameList />
            </SkipSSR>,
          ]}
        </DisplayLine>
        <DisplayLine
          className="flex gap-2"
          keygen="what"
          display={[1 / 2, 1 / 2]}
          itemClassName="rounded-lg bg-white shadow-md h-full"
        >
          {[
            <Statistics
              key="statistics"
              todayTasks={5}
              monthlyTasks={42}
              chartData={sampleData}
            />,
          ]}
        </DisplayLine>
      </div>
    </div>
  );
};

const VeryTop = () => {
  return <>very top</>;
};

const Trace = () => {
  return <>trace</>;
};

const Timeline = () => {
  return <>timeline</>;
};

const Playground = () => {
  return <>playground</>;
};
