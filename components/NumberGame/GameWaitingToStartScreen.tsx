import { Anvil, Play, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface GameWaitingToStartScreenProps {
  onStart: () => void;
}

export default function GameWaitingToStartScreen({
  onStart,
}: GameWaitingToStartScreenProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onStart} className="w-full">
        <Anvil className="mr-2" />
        开始练习
      </Button>
    </div>
  );
}
