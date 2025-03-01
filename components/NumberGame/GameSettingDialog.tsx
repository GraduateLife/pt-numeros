// ... existing code ...

import { Label } from "@radix-ui/react-label";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface GameSettingsDialogProps {
  title: string;
  description: string;
  storageKey: string;
  defaultValue?: number;
  label: string;
  unit?: string;
  onSettingsSaved?: (value: number) => void;
}

const GameSettingsDialog = ({
  title,
  description,
  storageKey,
  defaultValue = 10,
  label,
  unit,
  onSettingsSaved,
}: GameSettingsDialogProps) => {
  const [value, setValue] = useState(
    Number(localStorage.getItem(storageKey)) || defaultValue,
  );

  const handleSubmit = () => {
    localStorage.setItem(storageKey, value.toString());
    onSettingsSaved?.(value);
    toast.success("设置完成");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div className="flex items-center justify-center space-x-2">
          <Label htmlFor="setting-value" className="min-w-20">
            {label}
          </Label>
          <Input
            autoFocus
            type="number"
            id="setting-value"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          {unit && <span>{unit}</span>}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            确认设置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Replace PracticeOneByOneDialog with this usage:
export const PracticeOneByOneDialog = () => (
  <GameSettingsDialog
    title="练习一题"
    description="先来一题试试手吧"
    storageKey="answer-time-one-by-one"
    label="解答时长"
    unit="秒"
  />
);

// ... existing code ...
