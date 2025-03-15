// ... existing code ...
import { GameMode } from "@/components/GameSection/constants";

const HISTORY_KEY = "number-game-history";

export interface GameHistory {
  userInput: string;
  gameMode: GameMode;
  referenceAnswer: string;
  timestamp: number;
  questionId: string;
}

export const historyStorage = {
  getHistory: (): GameHistory[] => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  saveHistory: (history: GameHistory[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },
  appendHistory: (
    userInput: string,
    gameMode: GameMode,
    referenceAnswer: string,
    questionId: string,
  ): void => {
    if (typeof window === "undefined") return;
    const currentHistory = historyStorage.getHistory();
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([
        ...currentHistory,
        {
          userInput,
          gameMode,
          referenceAnswer,
          timestamp: Date.now(),
          questionId,
        },
      ]),
    );
  },

  clearHistory: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
  },
};
