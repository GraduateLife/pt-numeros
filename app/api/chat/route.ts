import { getModelName } from "@/lib/ollama-util";
import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, lang_req } = await req.json();

  // Get saved settings
  if (lang_req) {
    console.log(await getModelName());
    // Regular chat request
    const result = streamText({
      model: ollama(await getModelName()),
      messages: [...messages, { role: "user", content: lang_req }],
    });
    console.log(result.toDataStreamResponse());
    return result.toDataStreamResponse();
  }
}
