import { useRouter } from "next/navigation";
import { GameMode, toKebabCase } from "./constants";
import { GameModeButton } from "./GameModeButton";

interface GameWaitingToStartScreenProps {
  allowedGameModes: GameMode[];
  gameName: string;
}

const buildGameUrl = (whatGame: string, gameMode: GameMode) => {
  const baseParams = new URLSearchParams({
    round: "1",
  });

  switch (gameMode) {
    case GameMode.OneByOne:
      return `/${whatGame}/${toKebabCase(GameMode.OneByOne)}?${baseParams.toString()}`;
    case GameMode.TillCrash:
      return `/${whatGame}/${toKebabCase(GameMode.TillCrash)}?${baseParams.toString()}`;
    case GameMode.Timed:
      return `/${whatGame}/${toKebabCase(GameMode.Timed)}?${baseParams.toString()}`;
    default:
      throw new Error("This mode is not supported for this game");
  }
};

export default function GameWaitingToStartScreen({
  allowedGameModes,
  gameName,
}: GameWaitingToStartScreenProps) {
  const router = useRouter();
  const handleStartGame = (mode: GameMode) => {
    router.push(buildGameUrl(gameName, mode));
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {allowedGameModes.map((mode) => (
          <GameModeButton
            key={mode}
            modeName={mode}
            handleStartGame={handleStartGame}
          />
        ))}
      </div>
    </div>
  );
}
