"use server";

import { promises as fs } from "fs";
import path from "path";

// Define return type for clarity
type ActionResponse = { success: boolean; message: string } | null;

// Define settings type
export interface ChatSettings {
  model: string;
  isPersistent: boolean;
}

// Path to settings file
const SETTINGS_FILE = path.join(process.cwd(), "data", "chat-settings.json");

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Get the current settings
export async function getChatSettings(): Promise<ChatSettings> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(data);
    console.log("Retrieved settings from file:", settings);
    return settings;
  } catch (error) {
    // Default settings if file doesn't exist or can't be read
    console.log("Could not read settings file, using defaults");
    return {
      model: "llama3.2",
      isPersistent: false,
    };
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
  console.log("isPersistent type:", typeof formData.get("isPersistent"));
  console.log("isPersistent value:", formData.get("isPersistent"));

  try {
    await ensureDataDir();

    const settings = { model, isPersistent };

    // Save settings to file
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));

    console.log("Settings saved successfully:", settings);

    // TODO: In production, you might want to save to a database instead
    // await db.chatSettings.update({ model, isPersistent })

    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
