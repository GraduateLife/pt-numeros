import { GameMode } from "@/components/NumberGame/constants";
import { settingsStorage } from "./settings";

// const LIVES_KEY = "number-game-lives";

export interface LivesState {
  remainingLives: number;
}

export const restLifeStorage = {
  getRestLife: (livesKey: string, settingKey: string): LivesState | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(livesKey);
    if (!stored) {
      const allLives =
        settingsStorage.getSettings(settingKey)[GameMode.TillCrash].lives;
      return { remainingLives: allLives };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  saveLives: (remainingLives: number, livesKey: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      livesKey,
      JSON.stringify({
        remainingLives,
      }),
    );
  },
  isDead: (livesKey: string, settingKey: string): boolean => {
    const lives = restLifeStorage.getRestLife(livesKey, settingKey);
    return lives?.remainingLives === 0;
  },
  reduceLife: (livesKey: string, settingKey: string): void => {
    const lives = restLifeStorage.getRestLife(livesKey, settingKey);
    if (lives) {
      lives.remainingLives--;
      restLifeStorage.saveLives(lives.remainingLives, livesKey);
    }
  },

  clearLives: (livesKey: string, settingKey: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(livesKey);
  },
};
