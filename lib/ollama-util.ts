import { getChatSettings } from "@/app/actions";

/**
 * Returns the model name to use for Ollama requests
 * Checks settings or falls back to environment variables and then to default
 */
export async function getModelName(): Promise<string> {
  // This would ideally come from your settings service or database
  // For now we'll use environment variables or a default
  const settings = await getChatSettings();
  return settings.model;
}
