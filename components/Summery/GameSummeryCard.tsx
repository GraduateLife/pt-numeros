import { LetsPlayNumberGame } from "@/components/GameSection/number-game";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

type GameSummeryCardProps = {
  sequenceNum: number;
  questionId: string;
  userInput: string;
  referenceAnswer: string;
};

export const GameSummeryCard = ({
  sequenceNum,
  questionId,
  userInput,
  referenceAnswer,
}: GameSummeryCardProps) => {
  const answerCondition = useMemo(() => {
    if (userInput === "") {
      return null;
    }
    if (LetsPlayNumberGame.isAnswerCorrect(userInput, referenceAnswer)) {
      return true;
    }
    return false;
  }, [userInput, referenceAnswer]);

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            questionId,
            userInput,
            referenceAnswer,
            sequenceNum,
          } satisfies GameSummeryCardProps),
        );
      }}
      className={cn(
        "min-w-[110px] text-center border rounded-lg select-none max-w-[200px] cursor-move",
        (answerCondition === false || answerCondition === null) &&
          "bg-red-100 border-red-600",
        answerCondition === true && "bg-green-100 border-green-600",
        "cursor-grab active:cursor-grabbing",
      )}
    >
      <CardHeader className="text-xl font-bold text-red-600 p-2">
        <span
          className={cn(
            "self-start",
            (answerCondition === false || answerCondition === null) &&
              "text-red-600",
            answerCondition === true && "text-green-600",
          )}
        >
          Q{sequenceNum}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-xl">
          <span className="font-semibold">正确答案: </span>
          <span>{referenceAnswer}</span>
        </div>
        <div className="flex flex-col items-center text-xl">
          <div className="flex-1">
            <span className="font-semibold">你的答案:</span>
            <span
              className={cn(
                "line-clamp-2 w-[200px] break-all",
                answerCondition === false
                  ? "text-red-600"
                  : answerCondition
                    ? "text-green-600"
                    : "",
              )}
            >
              {answerCondition === null ? "你没有回答!" : userInput}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter
        className="hover:bg-amber-800 cursor-pointer flex items-center justify-center gap-x-2 bg-amber-400 py-2 rounded-b-md"
        onClick={() => speak(referenceAnswer)}
      >
        <span className="text-slate-100 font-bold">再听一次</span>
        <Volume2 className="stroke-slate-100" />
      </CardFooter>
    </Card>
  );
};
