export type IPracticeMode = "one-by-one" | "till-crash" | "timed";

export type AnswerResult = {
  q: number;
  a: number;
  isCorrect: boolean;
};

export type GameStatus = "playing" | "waiting-to-start" | "end";
