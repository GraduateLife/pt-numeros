import { ChevronRight, LayoutGrid, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import { speak } from "@/lib/speak";
import { isAnswerCorrect } from "./GamePlayingScreen";

interface GameEndScreenProps {
  roundCount: number;
  correctCount: number;
  currentNumber: number;
  userInput: string;
  onNext: () => void;
  onEnd: () => void;
}

export default function GameEndScreen({
  roundCount,
  correctCount,
  currentNumber,
  userInput,
  onNext,
  onEnd,
}: GameEndScreenProps) {
  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">
        你的正确率: {correctCount + "/" + roundCount}
      </div>
      <div className="text-center space-y-2">
        <div
          className={`text-lg ${
            isAnswerCorrect(userInput, currentNumber)
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {userInput === ""
            ? "你没有回答!"
            : isAnswerCorrect(userInput, currentNumber)
            ? "回答正确!"
            : "回答错误, 本轮结束!"}
        </div>
        <div className="relative">
          <div className="text-xl">正确答案: {currentNumber}</div>
          <Volume2
            onClick={() => speak(currentNumber.toString())}
            className="absolute cursor-pointer right-0 top-0 stroke-green-600"
          />
        </div>

        <div className="relative">
          <div className="text-xl">
            你的答案: {userInput === "" ? "你没有回答!" : userInput}
          </div>
          {!isAnswerCorrect(userInput, currentNumber) && userInput !== "" && (
            <Volume2
              onClick={() => speak(userInput)}
              className="absolute cursor-pointer right-0 top-0 stroke-red-600"
            />
          )}
        </div>
      </div>

      <Button onClick={onNext} className="w-full">
        <ChevronRight className="mr-2" />
        再来一题
      </Button>
      <Button onClick={onEnd} className="w-full">
        <LayoutGrid className="mr-2" />
        返回开始页面
      </Button>
    </div>
  );
}
