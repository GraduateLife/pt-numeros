import { getChatSettings } from "@/app/actions";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Path to chat history file
const HISTORY_FILE = path.join(process.cwd(), "data", "chat-history.json");

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Message type
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Get chat history
export async function GET() {
  try {
    const settings = await getChatSettings();

    // If chats are not persistent, return empty history
    if (!settings.isPersistent) {
      return NextResponse.json({ messages: [] });
    }

    await ensureDataDir();

    try {
      const data = await fs.readFile(HISTORY_FILE, "utf8");
      return NextResponse.json({ messages: JSON.parse(data) });
    } catch (error) {
      // If file doesn't exist, return empty history
      return NextResponse.json({ messages: [] });
    }
  } catch (error) {
    console.error("Error reading chat history:", error);
    return NextResponse.json(
      { error: "Failed to read chat history" },
      { status: 500 },
    );
  }
}

// Save chat history
export async function POST(req: Request) {
  try {
    const settings = await getChatSettings();
    const { messages } = await req.json();

    // If chats are not persistent, don't save
    if (!settings.isPersistent) {
      return NextResponse.json({ success: true });
    }

    await ensureDataDir();

    // Save messages to file
    await fs.writeFile(HISTORY_FILE, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Failed to save chat history" },
      { status: 500 },
    );
  }
}
