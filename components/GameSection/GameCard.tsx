"use client";

import { useEffect } from "react";

import { historyStorage } from "@/app/storage/history";
import { settingsStorage } from "@/app/storage/settings";
import { useState } from "react";
import GameSettingsDialog from "./GameSettingDialog";
import GameWaitingToStartScreen from "./GameWaitingToStartScreen";
import { GameClass } from "./number-game";

export default function GameCard({ GameClass }: { GameClass: GameClass }) {
  const [settings, setSettings] = useState(
    settingsStorage.getSettings(
      GameClass.settingKey,
      GameClass.defaultSettings,
    ),
  );
  useEffect(() => {
    historyStorage.clearHistory();
  }, []);

  return (
    <div className="flex flex-col p-1">
      <span className="text-sm text-center">{GameClass.gameDescription}</span>
      <div className="flex items-center justify-between p-1 ">
        <GameWaitingToStartScreen
          allowedGameModes={GameClass.allowedGameModes}
          gameName={GameClass.gameSlug}
        />
        <GameSettingsDialog
          settings={settings}
          onSettingsChange={(newSettings) => {
            setSettings(newSettings);
            settingsStorage.saveSettings(GameClass.settingKey, newSettings);
          }}
          onSettingsReset={() => {
            setSettings(GameClass.defaultSettings);
            settingsStorage.clearSettings(GameClass.settingKey);
          }}
        />
      </div>
    </div>
  );
}
