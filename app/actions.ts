"use server";

import { chatSettingsStore } from "@/lib/redis-client/chat-setting";

// Define return type for clarity
type ActionResponse = { success: boolean; message: string } | null;

// Define settings type
export interface ChatSettings {
  model: string;
  isPersistent: boolean;
}

// Default settings
const DEFAULT_SETTINGS: ChatSettings = {
  model: "llama2",
  isPersistent: false,
};

// Get the current settings
export async function getChatSettings(): Promise<ChatSettings> {
  try {
    const settings = await chatSettingsStore.getAll();

    // If no settings exist yet, return defaults
    if (!Object.keys(settings).length) {
      console.log("No settings found in Redis, using defaults");
      return DEFAULT_SETTINGS;
    }

    // Convert from flat key-value to structured object
    const chatSettings: ChatSettings = {
      model: settings.model || DEFAULT_SETTINGS.model,
      isPersistent: settings.isPersistent || DEFAULT_SETTINGS.isPersistent,
    };

    console.log("Retrieved settings from Redis:", chatSettings);
    return chatSettings;
  } catch (error) {
    console.error("Error retrieving settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateChatSettings(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  console.log(
    "Raw formData in server action:",
    Object.fromEntries(formData.entries()),
  );

  const model = formData.get("model") as string;
  const isPersistent = formData.get("isPersistent") === "true";

  console.log("Processed values:", { model, isPersistent });

  try {
    // Save settings to Redis
    await chatSettingsStore.set("model", model);
    await chatSettingsStore.set("isPersistent", isPersistent);

    console.log("Settings saved successfully to Redis:", {
      model,
      isPersistent,
    });

    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
