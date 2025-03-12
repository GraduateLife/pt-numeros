import { cn } from "@/lib/utils";
import { AnvilIcon, ClockIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { GameMode, GameModeZh } from "./constants";

type GameModeDisplay = {
  mode: GameMode;
  label: string;
  icon: React.ReactNode;
};

const gameModeDisplay: GameModeDisplay[] = [
  {
    mode: GameMode.OneByOne,
    label: GameModeZh["one-by-one"],
    icon: <ThumbsUpIcon />,
  },
  {
    mode: GameMode.TillCrash,
    label: GameModeZh["till-crash"],
    icon: <AnvilIcon />,
  },
  { mode: GameMode.Timed, label: GameModeZh.timed, icon: <ClockIcon /> },
];

export const GameModeButton = ({
  modeName,
  handleStartGame,
  className,
}: {
  modeName: GameMode;
  handleStartGame: (mode: GameMode) => void;
  className?: string;
}) => {
  const modeDisplay = gameModeDisplay.find((mode) => mode.mode === modeName);
  if (!modeDisplay) {
    throw new Error(`Mode ${modeName} not found`);
  }
  const { mode, label, icon } = modeDisplay;
  return (
    <Button
      className={cn("w-full", className)}
      onClick={() => handleStartGame(mode)}
    >
      {icon}「{label}」
    </Button>
  );
};
