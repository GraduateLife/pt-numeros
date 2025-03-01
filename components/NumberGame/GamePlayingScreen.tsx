import { IPracticeMode } from "@/app/page";
import { speak } from "@/lib/speak";
import { Hand, Volume2 } from "lucide-react";
import { useCallback, useState } from "react";
import SpinnerCountDown from "../Common/SpinnerCountDown";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
interface GamePlayingScreenProps {
  currentNumber: number;
  roundCount: number;
  givenSeconds: number;
  mode: IPracticeMode;
  emitAnswerSignal: (isCorrect: boolean) => void;
  emitUserInput: (input: string) => void;
  emitGameEnd: () => void;
}

export const isAnswerCorrect = (userInput: string, answerNumber: number) => {
  return Number.parseInt(userInput) === answerNumber;
};

export default function GamePlayingScreen({
  currentNumber,
  roundCount,
  givenSeconds,
  mode,
  emitAnswerSignal,
  emitUserInput,
  emitGameEnd,
}: GamePlayingScreenProps) {
  const [userInput, setUserInput] = useState("");

  const checkAnswer = useCallback(() => {
    if (isAnswerCorrect(userInput, currentNumber)) {
      emitAnswerSignal(true);
    } else {
      emitAnswerSignal(false);
    }
    localStorage.setItem(
      "Q" + roundCount,
      currentNumber.toString() +
        "?" +
        userInput +
        "?" +
        isAnswerCorrect(userInput, currentNumber),
    );
    emitUserInput(userInput);
    setUserInput("");
  }, [userInput, currentNumber]);
  return (
    <div className="space-y-4">
      {mode !== "timed" && (
        <div className="text-center text-xl font-bold">第 {roundCount} 轮</div>
      )}
      <div className="flex justify-center">
        <SpinnerCountDown
          key={givenSeconds}
          duration={givenSeconds}
          onComplete={checkAnswer}
        />
      </div>

      <div className="flex justify-center gap-x-1">
        <Button
          variant="outline"
          size="lg"
          onClick={() => speak(currentNumber.toString())}
          className="w-full"
        >
          <Volume2 className="mr-2" />
          再次播放
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={emitGameEnd}
          className="w-full"
        >
          <Hand className="mr-2" />
          我放弃! 进入结算页面
        </Button>
      </div>

      <div className="flex gap-x-2">
        <Input
          autoFocus
          type="text"
          placeholder="输入听到的数字"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
          className="text-center text-lg flex-1"
          maxLength={3}
        />
        <Button onClick={checkAnswer} className="w-24">
          提交答案
        </Button>
      </div>
      <div className="text-center text-sm text-gray-500">
        按下 Enter 键或点击按钮提交答案哦
      </div>
    </div>
  );
}
