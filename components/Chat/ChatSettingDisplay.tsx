"use client";

import { getChatSettings, updateChatSettings } from "@/app/actions";
import InformationTooltip from "@/components/Common/InfomationTooltip";
import { RefreshCw } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

interface ChatSettings {
  model: string;
  isPersistent: boolean;
}

type ActionResponse = { success: boolean; message: string } | null;

interface ModelOption {
  id: string;
  name: string;
}

export const ChatSettingDisplay = () => {
  const [state, formAction] = useActionState(updateChatSettings, null);
  const prevStateRef = useRef<ActionResponse>(null);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isPersistent, setIsPersistent] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getChatSettings();
      console.log("Loaded settings:", settings);
      setSelectedModel(settings.model);
      setIsPersistent(settings.isPersistent || false);
      setIsInitialized(true);
    };

    loadSettings();
  }, []);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/models");
        const data = await response.json();

        if (data.models && data.models.length > 0) {
          console.log("Models fetched successfully:", data.models);
          setModels(data.models);

          // Only update selected model if we don't already have a valid one and we're initialized
          if (
            isInitialized &&
            (!selectedModel ||
              !data.models.some((m: ModelOption) => m.id === selectedModel))
          ) {
            setSelectedModel(data.models[0].id);
          }
        } else {
          // Instead of throwing an error, set empty models array
          console.log("No models returned from API");
          setModels([]);
          toast("No models available. Please click refresh to pull models.", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
        toast("Failed to load models. Please try refreshing.", {
          duration: 5000,
        });
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [refreshTrigger, isInitialized]);

  // Function to manually trigger a refresh
  const handleRefresh = () => {
    console.log("Refresh button clicked");
    setRefreshTrigger((prev) => prev + 1);
  };

  // Update selected model when it changes
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  // Handle persistent toggle change
  const handlePersistentChange = (checked: boolean) => {
    console.log("Switch toggled to:", checked);
    setIsPersistent(checked);
  };

  // Add a SubmitButton component to handle the isPending state
  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending || isLoading} className="w-full">
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    );
  }

  // Use useEffect to show toast only when state changes
  useEffect(() => {
    if (state && state !== prevStateRef.current) {
      toast(state.message);
      prevStateRef.current = state;
    }
  }, [state]);

  // Handle form submission with correct data
  const handleFormAction = async (formData: FormData) => {
    formData.set("model", selectedModel);
    formData.set("isPersistent", isPersistent.toString());
    console.log("Submitting form data:", {
      model: formData.get("model"),
      isPersistent: formData.get("isPersistent"),
    });
    return formAction(formData);
  };

  return (
    <div className="flex flex-col justify-between p-4 h-[100vh]">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Chat Settings</h2>

        <form action={handleFormAction} className="space-y-6">
          {/* Hidden field to ensure isPersistent is included in form data */}
          <input
            type="hidden"
            name="isPersistent"
            value={isPersistent.toString()}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="model">Chat Model</Label>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 w-8"
                aria-label="Refresh models"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh models</span>
              </Button>
            </div>
            <Select
              name="model"
              value={selectedModel}
              onValueChange={handleModelChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading models..." : "Select a model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading models...
                  </SelectItem>
                ) : models.length === 0 ? (
                  <SelectItem value="no-models" disabled>
                    No models available. Please click refresh.
                  </SelectItem>
                ) : (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPersistentSwitch"
              checked={isPersistent}
              onCheckedChange={handlePersistentChange}
            />
            <div className="flex items-center">
              <Label htmlFor="isPersistentSwitch">Persistent Chat</Label>
              <InformationTooltip
                text="Persistent chats are saved and remain available after closing the browser. Non-persistent chats are temporary and will be lost when the session ends."
                size={14}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Current persistence setting: {isPersistent ? "Enabled" : "Disabled"}
          </div>

          <SubmitButton />

          {state && (
            <p className={state.success ? "text-green-500" : "text-red-500"}>
              {state.message}
            </p>
          )}
        </form>
      </div>

      <div className="flex-end">
        <Button className="w-full">Translate</Button>
      </div>
    </div>
  );
};
