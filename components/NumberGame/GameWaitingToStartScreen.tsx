import { Anvil, Pencil, Timer } from "lucide-react";
import { Button } from "../ui/button";

interface GameWaitingToStartScreenProps {
  emitStartSignal: (mode: "one-by-one" | "till-crash" | "timed") => void;
}

export default function GameWaitingToStartScreen({
  emitStartSignal,
}: GameWaitingToStartScreenProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => emitStartSignal("one-by-one")}
        >
          <Pencil className="mr-2" />
          练习一题
        </Button>
      </div>
      <Button onClick={() => emitStartSignal("till-crash")} className="w-full">
        <Anvil className="mr-2" />
        Rush 模式
      </Button>
      <Button onClick={() => emitStartSignal("timed")} className="w-full">
        <Timer className="mr-2" />
        限时练习
      </Button>
    </div>
  );
}
