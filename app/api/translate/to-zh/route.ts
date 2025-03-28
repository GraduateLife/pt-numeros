import { getModelName } from "@/lib/ollama-util";
import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";
export async function POST(req: Request) {
  const { text } = await req.json();

  // If text is provided, it's a text analysis request
  if (text) {
    const result = streamText({
      model: ollama(await getModelName()),
      messages: [
        {
          role: "user",
          content: `translate to 中文:\n${text}`,
        },
      ],
    });
    return result.toDataStreamResponse();
  }
}
