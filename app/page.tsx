"use client";
import GameSettingsDialog from "@/components/NumberGame/GameSettingDialog";
import GameWaitingToStartScreen from "@/components/NumberGame/GameWaitingToStartScreen";
import { LetsPlayNumberGame } from "@/components/NumberGame/number-game";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { historyStorage } from "./storage/history";
import { settingsStorage } from "./storage/settings";

export default function NumberGame() {
  const [settings, setSettings] = useState(
    settingsStorage.getSettings(
      LetsPlayNumberGame.settingKey,
      LetsPlayNumberGame.defaultSettings,
    ),
  );
  useEffect(() => {
    historyStorage.clearHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Card className="max-w-md mx-auto relative p-6 pt-0">
        <CardHeader>
          <CardTitle className="text-center">葡萄牙语数字专项练习</CardTitle>
        </CardHeader>
        <div className="absolute top-2 right-2">
          <GameSettingsDialog
            settings={settings}
            onSettingsChange={(newSettings) => {
              setSettings(newSettings);
              settingsStorage.saveSettings(
                LetsPlayNumberGame.settingKey,
                newSettings,
              );
            }}
            onSettingsReset={() => {
              setSettings(LetsPlayNumberGame.defaultSettings);
              settingsStorage.clearSettings(LetsPlayNumberGame.settingKey);
            }}
          />
        </div>

        <GameWaitingToStartScreen
          allowedGameModes={LetsPlayNumberGame.allowedGameModes}
          gameName={LetsPlayNumberGame.gameSlug}
        />
      </Card>
    </div>
  );
}
