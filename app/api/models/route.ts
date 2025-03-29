import { NextResponse } from "next/server";

export async function GET() {
  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  console.log("Using Ollama host:", ollamaHost);

  try {
    // Call the Ollama API to list models
    const response = await fetch(`${ollamaHost}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`Failed to fetch models: ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch models: ${response.statusText}`, models: [] },
        { status: 500 },
      );
    }

    const data = await response.json();

    // Extract model names and return them
    const models = data.models || [];
    console.log("Models retrieved:", models.length);

    return NextResponse.json({
      models: models.map((model: any) => ({
        id: model.name,
        name: model.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to connect to Ollama service", models: [] },
      { status: 500 },
    );
  }
}
