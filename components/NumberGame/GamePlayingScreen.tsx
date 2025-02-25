import { Volume2, Hand } from "lucide-react";
import SpinnerCountDown from "../Common/SpinnerCountDown";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { speak } from "@/lib/speak";
import { useCallback, useState } from "react";

interface GamePlayingScreenProps {
  currentNumber: number;
  roundCount: number;
  givenSeconds: number;
  emitAnswerSignal: (isCorrect: boolean) => void;
  emitUserInput: (input: string) => void;
}

export const isAnswerCorrect = (userInput: string, answerNumber: number) => {
  return Number.parseInt(userInput) === answerNumber;
};

export default function GamePlayingScreen({
  currentNumber,
  roundCount: _roundCount,
  givenSeconds,
  emitAnswerSignal,
  emitUserInput,
}: GamePlayingScreenProps) {
  const [userInput, setUserInput] = useState("");
  const [roundCount, setRoundCount] = useState(_roundCount + 1);

  const checkAnswer = useCallback(() => {
    if (isAnswerCorrect(userInput, currentNumber)) {
      emitAnswerSignal(true);
    } else {
      emitAnswerSignal(false);
    }
    emitUserInput(userInput);
    setUserInput("");
  }, [userInput, currentNumber, emitAnswerSignal, emitUserInput]);
  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">第 {roundCount} 轮</div>
      <div className="flex justify-center">
        <SpinnerCountDown duration={givenSeconds} onComplete={checkAnswer} />
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
          onClick={checkAnswer}
          className="w-full"
        >
          <Hand className="mr-2" />
          我放弃! 显示答案
        </Button>
      </div>

      <Input
        type="text"
        placeholder="输入听到的数字"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
        className="text-center text-lg"
        maxLength={3}
      />
    </div>
  );
}
