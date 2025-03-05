import { settingsStorage } from "./settings";

const LIVES_KEY = "number-game-lives";

export interface LivesState {
  remainingLives: number;
}

export const restLifeStorage = {
  getRestLife: (): LivesState | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(LIVES_KEY);
    if (!stored) {
      const allLives = settingsStorage.getSettings().tillCrash.lives;
      return { remainingLives: allLives };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  saveLives: (remainingLives: number): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      LIVES_KEY,
      JSON.stringify({
        remainingLives,
      }),
    );
  },
  isDead: (): boolean => {
    const lives = restLifeStorage.getRestLife();
    return lives?.remainingLives === 0;
  },
  reduceLife: (): void => {
    const lives = restLifeStorage.getRestLife();
    if (lives) {
      lives.remainingLives--;
      restLifeStorage.saveLives(lives.remainingLives);
    }
  },

  clearLives: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LIVES_KEY);
  },
};
