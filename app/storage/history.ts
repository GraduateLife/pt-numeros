// ... existing code ...

const HISTORY_KEY = "number-game-history";

export interface GameHistory {
  input: string;
  mode: string;
  answer: string;
  timestamp: number;
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
  appendHistory: (input: string, mode: string, answer: string): void => {
    if (typeof window === "undefined") return;
    const currentHistory = historyStorage.getHistory();
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([
        ...currentHistory,
        { input, mode, answer, timestamp: Date.now() },
      ]),
    );
  },

  clearHistory: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
  },
};
