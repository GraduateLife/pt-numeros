import { Anvil, Pencil, Timer } from "lucide-react";
import { Button } from "../ui/button";
import { GameMode, GameModeZh } from "./constants";

interface GameWaitingToStartScreenProps {
  emitStartSignal: (mode: GameMode) => void;
}

export default function GameWaitingToStartScreen({
  emitStartSignal,
}: GameWaitingToStartScreenProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => emitStartSignal(GameMode.OneByOne)}
        >
          <Pencil className="mr-2" />「{GameModeZh[GameMode.OneByOne]}」
        </Button>
      </div>
      <Button
        onClick={() => emitStartSignal(GameMode.TillCrash)}
        className="w-full"
      >
        <Anvil className="mr-2" />「{GameModeZh[GameMode.TillCrash]}」
      </Button>
      <Button
        onClick={() => emitStartSignal(GameMode.Timed)}
        className="w-full"
      >
        <Timer className="mr-2" />「{GameModeZh[GameMode.Timed]}」
      </Button>
    </div>
  );
}
