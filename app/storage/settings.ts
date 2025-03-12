import { GameSettings } from "@/components/NumberGame/GameSettingDialog";

export const settingsStorage = {
  getSettings: (key: string, defaultSettings?: GameSettings): GameSettings => {
    if (typeof window === "undefined" && defaultSettings)
      return defaultSettings;

    const stored = localStorage.getItem(key);
    if (!stored && defaultSettings) return defaultSettings;
    if (!stored) throw new Error("No settings found");

    try {
      return JSON.parse(stored);
    } catch {
      throw new Error("Invalid settings");
    }
  },

  saveSettings: (key: string, settings: GameSettings): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(settings));
  },
  clearSettings: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};
