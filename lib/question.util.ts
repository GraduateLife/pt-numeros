import { GameHistory } from "@/app/storage/history";
import { GameMode } from "@/components/GameSection/constants";

export type Question = {
  questionId: string;
  questionText: string;
  referenceAnswer: string;
  questionType: QuestionType;
  questionHint?: string;
  extraResource?: string;
};

export enum QuestionType {
  SingleChoice = "single_choice",
  MultipleChoice = "multiple_choice",
  FillFree = "fill_free",
  FillLimited = "fill_limited",
  Listening = "listening",
  Writing = "writing",
  Reading = "reading",
}

export type QuestionSummary = {
  sequenceNum: number;
  userInput: string;
  questionText: string;
  isCorrect: boolean;
  timestamp: number;
  gameMode: GameMode;
} & Question;

export const generateQuestionSummary = (
  history: GameHistory,
  sequenceNum: number,
  isAnswerCorrect: (input: string, answer: string) => boolean,
): QuestionSummary => {
  return {
    userInput: history.userInput,
    questionText: history.referenceAnswer,
    referenceAnswer: history.referenceAnswer,
    questionType: QuestionType.FillFree,
    isCorrect: isAnswerCorrect(history.userInput, history.referenceAnswer),
    timestamp: history.timestamp,
    gameMode: history.gameMode,
    questionId: history.questionId,
    sequenceNum,
  };
};
