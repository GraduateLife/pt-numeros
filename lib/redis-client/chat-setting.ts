import getRedisClient from "./client";
const CHAT_SETTINGS_PREFIX = "chat-settings:";
// Helper for settings KV operations
export const chatSettingsStore = {
  // Get a setting
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    const value = await client.get(`${CHAT_SETTINGS_PREFIX}${key}`);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return value as unknown as T;
    }
  },

  // Set a setting
  async set(key: string, value: any): Promise<boolean> {
    const client = getRedisClient();
    const valueToStore =
      typeof value === "object" ? JSON.stringify(value) : value;
    const result = await client.set(
      `${CHAT_SETTINGS_PREFIX}${key}`,
      valueToStore,
    );
    return result === "OK";
  },

  // Delete a setting
  async delete(key: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.del(`${CHAT_SETTINGS_PREFIX}${key}`);
    return result > 0;
  },

  // Get all settings (as key-value pairs)
  async getAll(): Promise<Record<string, any>> {
    const client = getRedisClient();
    const keys = await client.keys(`${CHAT_SETTINGS_PREFIX}*`);
    if (keys.length === 0) return {};

    const values = await client.mget(keys);
    return keys.reduce(
      (acc: Record<string, any>, key: string, index: number) => {
        const parsedKey = key.replace(CHAT_SETTINGS_PREFIX, "");
        try {
          acc[parsedKey] = JSON.parse(values[index]!);
        } catch {
          acc[parsedKey] = values[index];
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  },
};
