import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import InformationTooltip from "../Common/InfomationTooltip";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { GameMode, GameModeZh } from "./constants";

export interface GameSettings {
  general: {
    minNumber: number;
    maxNumber: number;
    defaultInstantCheckMode: boolean;
  };
  oneByOne: {
    timeLimit: number;
  };
  tillCrash: {
    timeLimit: number;
    lives: number;
  };
  timed: {
    timeLimit: number;
  };
}

interface GameSettingsDialogProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onSettingsReset: () => void;
}

export default function GameSettingsDialog({
  settings: defaultSettings,
  onSettingsChange,
  onSettingsReset,
}: GameSettingsDialogProps) {
  const [tempSettings, setTempSettings] =
    useState<GameSettings>(defaultSettings);
  const [open, setOpen] = useState(false);

  const updateSettings = (
    category: keyof GameSettings,
    field: string,
    value: number | boolean,
    constraints?: { min: number; max: number },
  ) => {
    const clampedValue = constraints
      ? typeof value === "number"
        ? Math.max(constraints.min, Math.min(constraints.max, value))
        : value
      : value;

    setTempSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: clampedValue,
      },
    }));
  };

  const handleConfirm = () => {
    onSettingsChange(tempSettings);
    setOpen(false);
    toast.success("设置已保存");
  };

  const handleReset = () => {
    onSettingsReset();
    toast.success("设置已重置");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setTempSettings({ ...defaultSettings });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mr-4">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[450px]">
        <DialogHeader>
          <DialogTitle>游戏设置</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          请根据需要调整游戏设置，然后点击确认按钮保存设置。
        </DialogDescription>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">通用设置</TabsTrigger>
            <TabsTrigger value="oneByOne">
              {GameModeZh[GameMode.OneByOne]}
            </TabsTrigger>
            <TabsTrigger value="tillCrash">
              {GameModeZh[GameMode.TillCrash]}
            </TabsTrigger>
            <TabsTrigger value="timed">
              {GameModeZh[GameMode.Timed]}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="min-number">最小数字</Label>
              <Input
                id="min-number"
                type="number"
                min={0}
                max={999}
                value={tempSettings.general.minNumber}
                onChange={(e) =>
                  updateSettings(
                    "general",
                    "minNumber",
                    Number(e.target.value),
                    { min: 0, max: 999 },
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="max-number">最大数字</Label>
              <Input
                id="max-number"
                type="number"
                min={0}
                max={999}
                value={tempSettings.general.maxNumber}
                onChange={(e) =>
                  updateSettings(
                    "general",
                    "maxNumber",
                    Number(e.target.value),
                    { min: 0, max: 999 },
                  )
                }
              />
            </div>
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Label htmlFor="default-instant-check-mode">
                  默认开启输完即验
                </Label>
                <InformationTooltip text="开启后，输入答案后立即进行答案验证，而不会等待点击提交按钮。" />
              </div>
              <Switch
                id="default-instant-check-mode"
                checked={tempSettings.general.defaultInstantCheckMode}
                onCheckedChange={(checked) =>
                  updateSettings("general", "defaultInstantCheckMode", checked)
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="oneByOne" className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="one-by-one-time-limit">时间限制 (秒)</Label>
              <Input
                id="one-by-one-time-limit"
                type="number"
                min={1}
                max={3600}
                value={tempSettings.oneByOne.timeLimit}
                onChange={(e) =>
                  updateSettings(
                    "oneByOne",
                    "timeLimit",
                    Number(e.target.value),
                    { min: 1, max: 3600 },
                  )
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="tillCrash" className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="till-crash-time-per-question">
                每题时间 (秒)
              </Label>
              <Input
                id="till-crash-time-per-question"
                type="number"
                min={1}
                max={300}
                value={tempSettings.tillCrash.timeLimit}
                onChange={(e) =>
                  updateSettings(
                    "tillCrash",
                    "timeLimit",
                    Number(e.target.value),
                    { min: 1, max: 300 },
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="till-crash-lives">生命值</Label>
              <Input
                id="till-crash-lives"
                type="number"
                min={1}
                max={10}
                value={tempSettings.tillCrash.lives}
                onChange={(e) =>
                  updateSettings("tillCrash", "lives", Number(e.target.value), {
                    min: 1,
                    max: 10,
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="timed" className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="timed-time-limit">时间限制 (秒)</Label>
              <Input
                id="timed-time-limit"
                type="number"
                min={1}
                max={3600}
                value={tempSettings.timed.timeLimit}
                onChange={(e) =>
                  updateSettings("timed", "timeLimit", Number(e.target.value), {
                    min: 1,
                    max: 3600,
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
