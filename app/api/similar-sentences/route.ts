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
          content: `You are a professional linguistics teacher, please follow these steps to deal with user-provided sentences:
1. Structural analysis: identify components such as [subject], [predicate], [object], [adverbial], [clause] in a sentence
2. Sentence classification: judging sentence structure (such as subject-verb-object, inverted sentence, conditional adverbial clause, etc.)
3. Generation Requirements: Create 3 new sentences that maintain the same grammatical structure, requirement:
- Use completely different topics and vocabulary
- Maintain consistent tenses, voice, and modifiers
- Make sure the logic is logical and grammatical,'`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });
    return result.toDataStreamResponse();
  }
}
