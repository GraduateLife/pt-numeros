export type Question = {
  questionId: number;
  userInput: string;
  questionText: string;
  referenceAnswer: string;
  questionType: QuestionType;
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
