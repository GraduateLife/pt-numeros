import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, custom } = await req.json();
  console.log(messages);

  const result = streamText({
    model: ollama("llama3.2:latest"),
    messages: [...messages, { role: "user", content: custom }],
  });

  return result.toDataStreamResponse();
}
