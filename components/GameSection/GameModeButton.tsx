import { cn } from "@/lib/utils";
import { AnvilIcon, CircleCheckBig, ClockIcon } from "lucide-react";
import { Button } from "../ui/button";
import { GameMode, GameModeZh } from "./constants";

type GameModeDisplay = {
  mode: GameMode;
  label: string;
  icon: React.ReactNode;
  color: string;
};

const gameModeDisplay: GameModeDisplay[] = [
  {
    mode: GameMode.OneByOne,
    label: GameModeZh["one-by-one"],
    icon: <CircleCheckBig />,
    color: "text-green-500",
  },
  {
    mode: GameMode.TillCrash,
    label: GameModeZh["till-crash"],
    icon: <AnvilIcon />,
    color: "text-red-500",
  },
  {
    mode: GameMode.Timed,
    label: GameModeZh.timed,
    icon: <ClockIcon />,
    color: "text-blue-500",
  },
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
  const { mode, label, icon, color } = modeDisplay;
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className={cn(className, color)}
      onClick={() => handleStartGame(mode)}
    >
      {icon}
    </Button>
  );
};
