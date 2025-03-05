import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAnswerCorrect = (userInput: string, answerNumber: number) => {
  return Number.parseInt(userInput) === answerNumber;
};
