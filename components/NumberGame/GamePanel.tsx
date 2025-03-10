"use client";

import { historyStorage } from "@/app/storage/history";
import { restLifeStorage } from "@/app/storage/restLife";
import { settingsStorage } from "@/app/storage/settings";
import { speak } from "@/lib/speak";
import { isAnswerCorrect } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Hand, Volume2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DigitInput } from "../Common/DigitInput";
import SpinnerCountDown from "../Common/SpinnerCountDown";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { GameMode, toKebabCase } from "./constants";

async function getQuestion(minNumber: number, maxNumber: number) {
  const response =
    Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  speak(response.toString());
  return response;
}

export default function GamePanel() {
  const { mode: modeParam } = useParams() as {
    mode: "one-by-one" | "till-crash" | "timed";
  };
  const settings = settingsStorage.getSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const round = searchParams.get("round");
  const [instantCheckMode, setInstantCheckMode] = useState(
    settings.general.defaultInstantCheckMode,
  );
  const [userInput, setUserInput] = useState("");

  const minNumber = settings.general.minNumber;
  const maxNumber = settings.general.maxNumber;

  const givenSeconds = useMemo(() => {
    switch (modeParam) {
      case toKebabCase(GameMode.OneByOne):
        return settings.oneByOne.timeLimit;
      case toKebabCase(GameMode.TillCrash):
        return settings.tillCrash.timeLimit;
      case toKebabCase(GameMode.Timed):
        return settings.timed.timeLimit;
      default:
        throw new Error("Invalid mode");
    }
  }, [
    modeParam,
    settings.oneByOne.timeLimit,
    settings.tillCrash.timeLimit,
    settings.timed.timeLimit,
  ]);

  const {
    data: question,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["question", minNumber, maxNumber],
    queryFn: () => getQuestion(minNumber, maxNumber),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const navigateToEndPage = useCallback(() => {
    router.replace(`/number-game/${modeParam}/end`);
  }, [router, modeParam]);

  const navigateToNextRound = useCallback(() => {
    router.replace(`/number-game/${modeParam}?round=${Number(round) + 1}`);
  }, [router, modeParam, round]);

  const handleTimeout = () => {
    if (modeParam === toKebabCase(GameMode.TillCrash)) {
      handleCheckAnswer();
    } else {
      const validatedInput = validateInput(userInput);
      historyStorage.appendHistory(
        validatedInput,
        modeParam,
        question!.toString(),
      );
      navigateToEndPage();
    }
  };
  const handleGiveUp = () => {
    handleCheckAnswer();
  };

  const validateInput = (value: string) => {
    if (!value) return "";
    const normalizedValue = value.replace(/^0+/, "") || "0";
    const res = Number(normalizedValue);

    if (isNaN(res)) {
      toast.error("这不是一个数字!");
      return "";
    }
    return normalizedValue;
  };

  const handleCheckAnswer = useCallback(() => {
    const validatedInput = validateInput(userInput);
    historyStorage.appendHistory(
      validatedInput,
      modeParam,
      question!.toString(),
    );

    try {
      switch (modeParam) {
        case toKebabCase(GameMode.OneByOne):
          navigateToEndPage();
          break;
        case toKebabCase(GameMode.TillCrash):
          if (isAnswerCorrect(validatedInput, question!)) {
            navigateToNextRound();
            refetch();
          } else {
            restLifeStorage.reduceLife();
            if (restLifeStorage.isDead()) {
              navigateToEndPage();
              restLifeStorage.clearLives();
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
    modeParam,
    question,
    navigateToEndPage,
    navigateToNextRound,
    refetch,
  ]);

  useEffect(() => {
    if (instantCheckMode && userInput.length === 3) {
      handleCheckAnswer();
    }
  }, [userInput, instantCheckMode, handleCheckAnswer]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">第 {round} 轮</div>
      <div className="flex justify-center">
        <SpinnerCountDown
          duration={givenSeconds}
          key={modeParam !== toKebabCase(GameMode.Timed) ? round : undefined}
          onComplete={handleTimeout}
        />
      </div>

      <div className="flex justify-center gap-x-1">
        <Button
          variant="outline"
          size="lg"
          onClick={() => speak(question!.toString())}
          className="w-full"
        >
          <Volume2 className="mr-2" />
          再次播放
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleGiveUp}
          className="w-full"
        >
          <Hand className="mr-2" />
          我不会!
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 justify-center items-center">
        <div className="text-center text-sm text-gray-500">
          按下 Enter 键或点击按钮提交答案哦
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="instant-check-mode">或开启输完即验模式</Label>
          <Switch
            id="instant-check-mode"
            checked={instantCheckMode}
            onCheckedChange={setInstantCheckMode}
          />
        </div>
        <DigitInput
          value={userInput}
          onChange={(value) => {
            setUserInput(value);
          }}
          onComplete={handleCheckAnswer}
          maxLength={3}
        />
        <Button
          variant={"confirm"}
          onClick={() => handleCheckAnswer()}
          className="w-24 mt-3"
        >
          提交答案
        </Button>
        {modeParam === toKebabCase(GameMode.Timed) && (
          <Button
            variant={"confirm"}
            onClick={() => handleTimeout()}
            className="w-fit mt-3"
          >
            放弃并进入结算
          </Button>
        )}
      </div>
    </div>
  );
}
