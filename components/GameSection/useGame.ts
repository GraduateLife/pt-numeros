import { historyStorage } from "@/app/storage/history";
import { restLifeStorage } from "@/app/storage/restLife";
import { settingsStorage } from "@/app/storage/settings";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const { gameSlug, mode: gameMode } = useParams<{
    gameSlug: string;
    mode: GameMode;
  }>();
  //   const pathname = usePathname();
  //   const gameName = pathname.split("/")[1];
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
  }, [gameMode, settings]);

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
    router.replace(`/${gameSlug}/${gameMode}/end`);
  }, [router, gameMode, gameSlug]);

  const navigateToNextRound = useCallback(() => {
    router.replace(`/${gameSlug}/${gameMode}?round=${Number(round) + 1}`);
  }, [router, gameMode, round, gameSlug]);

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
            restLifeStorage.reduceLife(GameClass.livesKey, GameClass);
            if (restLifeStorage.isDead(GameClass.livesKey, GameClass)) {
              navigateToEndPage();
              restLifeStorage.clearLives(GameClass.livesKey);
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
    setUserInput,
    validateInput,
    GameClass,
  ]);

  useEffect(() => {
    if (instantCheckMode && userInput.length === instantTriggerInputLength) {
      handleCheckAnswer();
    }
  }, [
    userInput,
    instantCheckMode,
    handleCheckAnswer,
    instantTriggerInputLength,
  ]);

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
