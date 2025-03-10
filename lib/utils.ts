import { Question } from "@/app/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//overload
export function isAnswerCorrect(
  userInput: string,
  answerNumber: number,
): boolean;
export function isAnswerCorrect(item: Question): boolean;
export function isAnswerCorrect(
  itemOrInput: string | Question,
  answerNumber?: number,
): boolean {
  if (typeof itemOrInput === "string") {
    return Number.parseInt(itemOrInput) === answerNumber;
  }
  return itemOrInput.userInput === itemOrInput.referenceAnswer;
}

export interface QuestionEnriched extends Question {
  isCorrect: boolean;
}

export const enrichQuestion = (item: Question): QuestionEnriched => {
  return {
    ...item,
    isCorrect: isAnswerCorrect(item),
  };
};
