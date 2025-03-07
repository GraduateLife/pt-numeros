"use client";
import { GameMode, toKebabCase } from "@/components/NumberGame/constants";
import GameSettingsDialog from "@/components/NumberGame/GameSettingDialog";
import GameWaitingToStartScreen from "@/components/NumberGame/GameWaitingToStartScreen";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { historyStorage } from "./storage/history";
import { defaultSettings, settingsStorage } from "./storage/settings";

const buildGameUrl = (mode: GameMode) => {
  const baseParams = new URLSearchParams({
    round: "1",
  });

  switch (mode) {
    case GameMode.OneByOne:
      return `/number-game/${toKebabCase(GameMode.OneByOne)}?${baseParams.toString()}`;
    case GameMode.TillCrash:
      return `/number-game/${toKebabCase(GameMode.TillCrash)}?${baseParams.toString()}`;
    case GameMode.Timed:
      return `/number-game/${toKebabCase(GameMode.Timed)}?${baseParams.toString()}`;
    default:
      throw new Error("Invalid practice mode");
  }
};

export default function NumberGame() {
  const router = useRouter();
  const [settings, setSettings] = useState(settingsStorage.getSettings());
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
              settingsStorage.saveSettings(newSettings);
            }}
            onSettingsReset={() => {
              setSettings(defaultSettings);
              settingsStorage.clearSettings();
            }}
          />
        </div>

        <GameWaitingToStartScreen
          emitStartSignal={(mode) => {
            router.push(buildGameUrl(mode));
          }}
        />
      </Card>
    </div>
  );
}
