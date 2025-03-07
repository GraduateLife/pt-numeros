import { GameSettings } from "@/components/NumberGame/GameSettingDialog";

export const defaultSettings: GameSettings = {
  general: {
    minNumber: 0,
    maxNumber: 100,
    defaultInstantCheckMode: false,
  },
  oneByOne: {
    timeLimit: 10,
  },
  tillCrash: {
    timeLimit: 10,
    lives: 3,
  },
  timed: {
    timeLimit: 60,
  },
};

const STORAGE_KEY = "number-game-settings";

export const settingsStorage = {
  getSettings: (): GameSettings => {
    if (typeof window === "undefined") return defaultSettings;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    try {
      return JSON.parse(stored);
    } catch {
      return defaultSettings;
    }
  },

  saveSettings: (settings: GameSettings): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
  clearSettings: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
