import Redis from "ioredis";

// Redis key prefixes
const SETTINGS_PREFIX = "settings:";
const CHAT_PREFIX = "chat:";
const HISTORY_PREFIX = "history:";
const LIVES_PREFIX = "lives:";
const GAME_SETTINGS_PREFIX = "game-settings:";

// Initialize Redis client with URL from environment or use default
const getRedisUrl = () => {
  // Use REDIS_URL from environment if provided, otherwise default to localhost
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  console.log("Using Redis URL:", redisUrl);
  return redisUrl;
};

// Create Redis client instance
let redisClient: Redis | null = null;

// Get Redis client (singleton pattern)
export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        // Retry with exponential backoff (max 2 seconds)
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on("error", (err: Error) => {
      console.error("Redis connection error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Connected to Redis");
    });
  }
  return redisClient;
};

// Helper for chat KV operations

export default getRedisClient;
