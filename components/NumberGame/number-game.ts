import { QuestionType } from "@/lib/question.util";

import { Question } from "@/lib/question.util";
import { speak } from "@/lib/speak";

export function isAnswerCorrect(userInput: string, answer: string): boolean {
  return Number.parseInt(userInput) === Number.parseInt(answer);
}

export async function generateQuestion(
  minNumber: number,
  maxNumber: number,
): Promise<Question> {
  const willSay = (
    Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
  ).toString();
  speak(willSay);

  return {
    questionId: crypto.randomUUID(),
    questionText: "你听到的数字是多少?",
    referenceAnswer: willSay,
    questionType: QuestionType.FillLimited,
    questionHint: "",
    extraResource: "",
  };
}
