import { historyStorage } from "@/app/storage/history";

import { useCallback, useMemo } from "react";
import { SkipSSR } from "../Common/SkipSSR";
import { useConfettiSideCannons } from "../Common/useConfettiSideCannons";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";

const calculateCorrectRate = (
  totalAttempts: number,
  correctAnswers: number,
) => {
  return {
    rate: totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
    fracString: `${correctAnswers}/${totalAttempts}`,
  };
};

const AccuracyIndicatorCore = ({
  isAnswerCorrect,
}: {
  isAnswerCorrect: (userInput: string, referenceAnswer: string) => boolean;
}) => {
  const history = historyStorage.getHistory();
  const totalAttempts = history.length;
  const correctAnswers = history.filter((entry) =>
    isAnswerCorrect(String(entry.userInput), String(entry.referenceAnswer)),
  ).length;
  const correctRate = useMemo(
    () => calculateCorrectRate(totalAttempts, correctAnswers).rate,
    [totalAttempts, correctAnswers],
  );
  const { trigger: _trigger } = useConfettiSideCannons();
  const trigger = useCallback(_trigger, [_trigger]);
  const fillColor = useMemo(() => {
    if (correctRate === 100) {
      trigger();
    }
    if (correctRate >= 75) {
      return "oklch(0.777 0.152 181.912)"; //teal-400
    }
    return "oklch(0.704 0.191 22.216)"; //red-400
  }, [correctRate, trigger]);
  return (
    <div className="flex items-center justify-center font-semibold">
      <span className="mr-2">你的正确率:</span>

      <AnimatedCircularProgressBar
        className="mx-auto size-16"
        max={totalAttempts}
        min={0}
        textClassName="text-sm"
        value={correctAnswers}
        gaugePrimaryColor={fillColor}
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
};

export const AccuracyIndicator = ({
  isAnswerCorrect,
}: {
  isAnswerCorrect: (userInput: string, referenceAnswer: string) => boolean;
}) => {
  return (
    <SkipSSR fallback={<span>计算中...</span>}>
      <AccuracyIndicatorCore isAnswerCorrect={isAnswerCorrect} />
    </SkipSSR>
  );
};
