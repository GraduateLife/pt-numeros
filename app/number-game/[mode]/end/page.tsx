"use client";
import { historyStorage } from "@/app/storage/history";
import { restLifeStorage } from "@/app/storage/restLife";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/speak";
import { isAnswerCorrect } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";

const calculateCorrectRate = () => {
  const history = historyStorage.getHistory();
  const totalAttempts = history.length;
  const correctAnswers = history.filter((entry) =>
    isAnswerCorrect(String(entry.input), Number(entry.answer)),
  ).length;

  return {
    rate:
      totalAttempts > 0
        ? ((correctAnswers / totalAttempts) * 100).toFixed(2)
        : "0",
    fracString: `${correctAnswers}/${totalAttempts}`,
  };
};

export default function GameEndPage() {
  const router = useRouter();
  const history = historyStorage.getHistory();

  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">
        你的正确率: {calculateCorrectRate().rate}% (
        {calculateCorrectRate().fracString})
      </div>

      {history.map((entry, index) => (
        <QuestionSummery
          key={index}
          questionId={index}
          userInput={String(entry.input)}
          question={String(entry.answer)}
        />
      ))}

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            historyStorage.clearHistory();
            restLifeStorage.clearLives();
            router.push(`/`);
          }}
        >
          再来一轮
        </Button>
      </div>
    </div>
  );
}

const QuestionSummery = ({
  questionId,
  userInput,
  question,
}: {
  questionId: number;
  userInput: string;
  question: string;
}) => {
  return (
    <div className="text-center space-y-2 border rounded-lg p-4 my-2">
      <div className="text-xl font-bold text-red-600">Q{questionId + 1}</div>
      <div className="relative">
        <div className="text-xl">正确答案: {question}</div>
        <Volume2
          onClick={() => speak(question)}
          className="absolute cursor-pointer right-0 top-0 stroke-green-600"
        />
      </div>
      <div className="relative">
        <div className="text-xl">
          你的答案: {userInput === "" ? "你没有回答!" : userInput}
        </div>
        {!isAnswerCorrect(userInput, Number(question)) && userInput !== "" && (
          <Volume2
            onClick={() => speak(userInput)}
            className="absolute cursor-pointer right-0 top-0 stroke-red-600"
          />
        )}
      </div>
    </div>
  );
};
