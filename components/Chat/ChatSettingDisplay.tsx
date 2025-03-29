"use client";

import { getChatSettings, updateChatSettings } from "@/app/actions";
import InformationTooltip from "@/components/Common/InfomationTooltip";
import { RefreshCw } from "lucide-react";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  const [state, formAction] = useActionState<any, FormData>(
    updateChatSettings.bind(null),
    null,
  );
  const prevStateRef = useRef<ActionResponse>(null);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isPersistent, setIsPersistent] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await getChatSettings();
        console.log("Loaded settings:", settings);
        setSelectedModel(settings.model);
        setIsPersistent(settings.isPersistent || false);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to load chat settings:", error);
        toast("Failed to load settings. Using defaults.", {
          duration: 5000,
        });
        // Set defaults if settings fail to load
        setIsPersistent(false);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Fetch available models
  useEffect(() => {
    // Only fetch models after we've loaded settings
    if (!isInitialized) return;

    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.models && data.models.length > 0) {
          console.log("Models fetched successfully:", data.models);
          setModels(data.models);

          // If the currently selected model isn't in the list, update to the first available model
          if (!data.models.some((m: ModelOption) => m.id === selectedModel)) {
            console.log(
              `Selected model ${selectedModel} not found in available models, updating to ${data.models[0].id}`,
            );
            setSelectedModel(data.models[0].id);

            // Auto-save the updated model
            const formData = new FormData();
            formData.set("model", data.models[0].id);
            formData.set("isPersistent", isPersistent.toString());
            startTransition(() => {
              formAction(formData);
            });
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
  }, [refreshTrigger, isInitialized, selectedModel, isPersistent, formAction]);

  // Function to manually trigger a refresh
  const handleRefresh = () => {
    console.log("Refresh button clicked");
    setRefreshTrigger((prev) => prev + 1);
  };

  // Update selected model when it changes
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    const formData = new FormData();
    formData.set("model", value);
    formData.set("isPersistent", isPersistent.toString());
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle persistent toggle change
  const handlePersistentChange = (checked: boolean) => {
    console.log("Switch toggled to:", checked);
    setIsPersistent(checked);
    const formData = new FormData();
    formData.set("model", selectedModel);
    formData.set("isPersistent", checked.toString());
    startTransition(() => {
      formAction(formData);
    });
  };

  // Use useEffect to show toast only when state changes
  useEffect(() => {
    if (state && state !== prevStateRef.current) {
      toast(state.message);
      prevStateRef.current = state;
    }
  }, [state]);

  return (
    <div className="flex flex-col justify-between p-4 h-[100vh]">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Chat Settings</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="model">Chat Model</Label>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleRefresh}
                disabled={isLoading || isPending}
                className="h-8 w-8"
                aria-label="Refresh models"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading || isPending ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh models</span>
              </Button>
            </div>
            <Select
              name="model"
              value={selectedModel}
              onValueChange={handleModelChange}
              disabled={isLoading || isPending}
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
              disabled={isPending}
            />
            <div className="flex items-center">
              <Label htmlFor="isPersistentSwitch">Persistent Chat</Label>
              <InformationTooltip
                text="Persistent chats are saved and remain available after closing the browser. Non-persistent chats are temporary and will be lost when the session ends."
                size={14}
              />
            </div>
          </div>

          {isPending && (
            <div className="text-xs text-blue-500">Saving settings...</div>
          )}

          {/* {state && (
            <p className={state.success ? "text-green-500" : "text-red-500"}>
              {state.message}
            </p>
          )} */}
        </div>
      </div>

      <div className="flex-end">
        <Button className="w-full">Translate</Button>
      </div>
    </div>
  );
};
