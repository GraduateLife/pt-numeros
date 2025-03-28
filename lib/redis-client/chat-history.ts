import getRedisClient from "./client";

const CHAT_HISTORY_PREFIX = "chat-history:";

export const chatHistoryStore = {
  // Get chat data
  async get(chatId: string): Promise<any | null> {
    const client = getRedisClient();
    const value = await client.get(`${CHAT_HISTORY_PREFIX}${chatId}`);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Error parsing chat data:", error);
      return null;
    }
  },

  // Set chat data
  async set(chatId: string, data: any): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.set(
      `${CHAT_HISTORY_PREFIX}${chatId}`,
      JSON.stringify(data),
    );
    return result === "OK";
  },

  // Delete a chat
  async delete(chatId: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.del(`${CHAT_HISTORY_PREFIX}${chatId}`);
    return result > 0;
  },

  // List all chat IDs
  async list(): Promise<string[]> {
    const client = getRedisClient();
    const keys = await client.keys(`${CHAT_HISTORY_PREFIX}*`);
    return keys.map((key: string) => key.replace(CHAT_HISTORY_PREFIX, ""));
  },
};
