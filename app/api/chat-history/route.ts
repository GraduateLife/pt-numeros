import { getChatSettings } from "@/app/actions";
import { chatHistoryStore } from "@/lib/redis-client/chat-history";
import { NextResponse } from "next/server";

// Message type
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string; // Add model field
  id?: string; // Support for message IDs
  createdAt?: Date; // Support for timestamps
}

// Get chat history
export async function GET() {
  try {
    const settings = await getChatSettings();
    const chatId = "default"; // Using a default chat ID

    // If chats are not persistent, return empty history
    if (!settings.isPersistent) {
      return NextResponse.json({ messages: [] });
    }

    try {
      const messages = await chatHistoryStore.get(chatId);
      return NextResponse.json({ messages: messages || [] });
    } catch (error) {
      // If no history exists, return empty history
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
    const chatId = "default"; // Using a default chat ID

    // If chats are not persistent, don't save
    if (!settings.isPersistent) {
      return NextResponse.json({ success: true });
    }

    // Ensure all messages have model information
    const messagesWithModel = messages.map((message: ChatMessage) => {
      // Only add model if it's not already specified
      if (!message.model && message.role === "assistant") {
        return {
          ...message,
          model: settings.model,
        };
      }
      return message;
    });

    // Save messages to Redis
    await chatHistoryStore.set(chatId, messagesWithModel);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Failed to save chat history" },
      { status: 500 },
    );
  }
}
