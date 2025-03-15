import { GameMode } from "@/components/GameSection/constants";
import { GameClass } from "@/components/GameSection/number-game";
import { settingsStorage } from "./settings";

// const LIVES_KEY = "number-game-lives";

export interface LivesState {
  remainingLives: number;
}

export const restLifeStorage = {
  getRestLife: (livesKey: string, GameClass: GameClass): LivesState | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(livesKey);
    if (!stored) {
      const allLives = settingsStorage.getSettings(
        GameClass.settingKey,
        GameClass.defaultSettings,
      )[GameMode.TillCrash].lives;
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
  isDead: (livesKey: string, GameClass: GameClass): boolean => {
    const lives = restLifeStorage.getRestLife(livesKey, GameClass);
    return lives?.remainingLives === 0;
  },
  reduceLife: (livesKey: string, GameClass: GameClass): void => {
    const lives = restLifeStorage.getRestLife(livesKey, GameClass);
    if (lives) {
      lives.remainingLives--;
      restLifeStorage.saveLives(lives.remainingLives, livesKey);
    }
  },

  clearLives: (livesKey: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(livesKey);
  },
};
