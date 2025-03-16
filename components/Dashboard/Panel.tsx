"use client";
import { DisplayLine } from "../Common/DisplayRow";
import { SkipSSR } from "../Common/SkipSSR";
import { BomDia } from "./BomDia";
import { GameList } from "./LetsPlay";
import Profile from "./Profile";
import { Statistics } from "./Statistics";
import TabSearch from "./TabSearch";
const sampleData = [
  { date: "2025-03-04", value: 10 },
  { date: "2025-03-05", value: 20 },
  { date: "2025-03-06", value: 15 },
  { date: "2025-03-07", value: 50 },
  { date: "2025-03-08", value: 30 }, //1
  { date: "2025-03-09", value: 0 }, //2
  { date: "2025-03-10", value: 10 }, //3
  { date: "2025-03-11", value: 120 }, //4
  { date: "2025-03-14", value: 90 }, //5
  { date: "2025-03-15", value: 180 }, //6
  { date: "2025-03-16", value: 10 }, //7
];
export const Panel = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="px-3 py-1 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          <div className="h-[6vh] w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse">
            <VeryTop />
          </div>
        </div>
        <DisplayLine
          className="gap-2 "
          keygen="top"
          display={[1 / 2, 1 / 4, 1 / 4]}
        >
          {[
            <BomDia key="bom-dia" />,
            // <WordFormaSearch key="word-forma-search" />,
            // <WordGenderSearch key="word-gender-search" />,
            <TabSearch key="tab-search" />,
            <Profile key="profile" />,
          ]}
        </DisplayLine>
        <DisplayLine
          className="flex-1 gap-2"
          keygen="what"
          display={[3 / 5, 2 / 5]}
          itemClassName="rounded-lg bg-white shadow-md h-full"
        >
          {[
            <Statistics
              key="statistics"
              todayTasks={5}
              monthlyTasks={42}
              chartData={sampleData}
            />,
            <SkipSSR key="game-list">
              <GameList />
            </SkipSSR>,
          ]}
        </DisplayLine>
      </div>
    </div>
  );
};

const VeryTop = () => {
  return <>{/* <OneLineCalender /> */}</>;
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
