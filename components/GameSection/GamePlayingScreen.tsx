"use client";

import { settingsStorage } from "@/app/storage/settings";
import { LetsPlayNumberGame } from "@/components/GameSection/number-game";
import { speak } from "@/lib/speak";
import { Hand, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DigitInput } from "../Common/DigitInput";
import SpinnerCountDown from "../Common/SpinnerCountDown";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { GameMode } from "./constants";
import { useGame } from "./useGame";

export default function GamePlayingScreen() {
  const settings = settingsStorage.getSettings(
    LetsPlayNumberGame.settingKey,
    LetsPlayNumberGame.defaultSettings,
  );

  const [instantCheckMode, setInstantCheckMode] = useState(
    settings.general.defaultInstantCheckMode,
  );
  const [userInput, setUserInput] = useState("");

  const validateInput = (value: string) => {
    if (!value) return "";
    const normalizedValue = value.replace(/^0+/, "") || "0";
    const res = Number(normalizedValue);
    if (isNaN(res)) {
      toast.error("这不是一个数字! 本题作答已作废!");
      return "不允许的输入";
    }
    return normalizedValue;
  };

  const {
    isLoading,
    givenSeconds,
    handleCheckAnswer,
    handleGiveUp,
    handleTimeout,
    question,
    round,
    gameMode,
  } = useGame({
    GameClass: LetsPlayNumberGame,
    validateInput: validateInput,
    userInput: userInput,
    setUserInput: setUserInput,
    instantCheckMode: instantCheckMode,
    instantTriggerInputLength: 3,
  });

  if (isLoading) {
    return <div>生成题目中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">第 {round} 轮</div>
      <div className="flex justify-center">
        <SpinnerCountDown
          duration={givenSeconds}
          key={gameMode !== GameMode.Timed ? round : undefined}
          onComplete={handleTimeout}
        />
      </div>

      <div className="flex justify-center gap-x-1">
        <Button
          variant="outline"
          size="lg"
          onClick={() => speak(question!.referenceAnswer)}
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
        {gameMode === GameMode.Timed && (
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
