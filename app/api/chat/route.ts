import { getChatSettings } from "@/app/actions";
import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, custom, text } = await req.json();

  // Get saved settings
  const settings = await getChatSettings();
  const modelName = settings.model || "llama3.2";

  if (custom) {
    // Regular chat request
    const result = streamText({
      model: ollama(modelName),
      messages: [...messages, { role: "user", content: custom }],
    });

    return result.toDataStreamResponse();
  }
}
