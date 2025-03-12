import { historyStorage } from "@/app/storage/history";
import { restLifeStorage } from "@/app/storage/restLife";
import { settingsStorage } from "@/app/storage/settings";
import { useQuery } from "@tanstack/react-query";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { GameMode } from "./constants";
import { GameClass } from "./number-game";

export const useGame = ({
  GameClass,
  validateInput,
  userInput,
  setUserInput,
  instantCheckMode,
  instantTriggerInputLength,
}: {
  GameClass: GameClass;
  validateInput: (input: string) => string;
  userInput: string;
  setUserInput: (input: string) => void;
  instantCheckMode: boolean;
  instantTriggerInputLength: number;
}) => {
  const { mode: gameMode } = useParams<{ mode: GameMode }>();
  const pathname = usePathname();
  const gameName = pathname.split("/")[1];
  const searchParams = useSearchParams();
  const round = searchParams.get("round");
  const router = useRouter();

  const settings = settingsStorage.getSettings(
    GameClass.settingKey,
    GameClass.defaultSettings,
  );

  const givenSeconds = useMemo(() => {
    switch (gameMode) {
      case GameMode.OneByOne:
        return settings[GameMode.OneByOne].timeLimit;
      case GameMode.TillCrash:
        return settings[GameMode.TillCrash].timeLimit;
      case GameMode.Timed:
        return settings[GameMode.Timed].timeLimit;
      default:
        throw new Error("Invalid mode");
    }
  }, [
    gameMode,
    settings[GameMode.OneByOne].timeLimit,
    settings[GameMode.TillCrash].timeLimit,
    settings[GameMode.Timed].timeLimit,
  ]);

  const {
    data: question,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["question"],
    queryFn: () => GameClass.generateQuestion(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const navigateToEndPage = useCallback(() => {
    router.replace(`/${gameName}/${gameMode}/end`);
  }, [router, gameMode]);

  const navigateToNextRound = useCallback(() => {
    router.replace(`/${gameName}/${gameMode}?round=${Number(round) + 1}`);
  }, [router, gameMode, round]);

  const handleTimeout = () => {
    if (gameMode === GameMode.TillCrash) {
      handleCheckAnswer();
    } else {
      const validatedInput = validateInput(userInput);
      historyStorage.appendHistory(
        validatedInput,
        gameMode,
        question!.referenceAnswer,
        question!.questionId,
      );
      navigateToEndPage();
    }
  };
  const handleGiveUp = () => {
    handleCheckAnswer();
  };

  const handleCheckAnswer = useCallback(() => {
    const validatedInput = validateInput(userInput);
    historyStorage.appendHistory(
      validatedInput,
      gameMode,
      question!.referenceAnswer,
      question!.questionId,
    );

    try {
      switch (gameMode) {
        case GameMode.OneByOne:
          navigateToEndPage();
          break;
        case GameMode.TillCrash:
          if (
            GameClass.isAnswerCorrect(validatedInput, question!.referenceAnswer)
          ) {
            navigateToNextRound();
            refetch();
          } else {
            restLifeStorage.reduceLife(
              GameClass.livesKey,
              GameClass.settingKey,
            );
            if (
              restLifeStorage.isDead(GameClass.livesKey, GameClass.settingKey)
            ) {
              navigateToEndPage();
              restLifeStorage.clearLives(
                GameClass.livesKey,
                GameClass.settingKey,
              );
            } else {
              navigateToNextRound();
              refetch();
            }
          }
          break;
        case GameMode.Timed:
          navigateToNextRound();
          refetch();
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserInput("");
    }
  }, [
    userInput,
    gameMode,
    question,
    navigateToEndPage,
    navigateToNextRound,
    refetch,
  ]);

  useEffect(() => {
    if (instantCheckMode && userInput.length === instantTriggerInputLength) {
      handleCheckAnswer();
    }
  }, [userInput, instantCheckMode, handleCheckAnswer]);

  return {
    question,
    round,
    gameMode,
    isLoading,
    givenSeconds,
    handleCheckAnswer,
    handleGiveUp,
    handleTimeout,
  };
};
