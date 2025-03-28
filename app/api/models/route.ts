import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call the Ollama API to list models
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract model names and return them
    const models = data.models || [];

    return NextResponse.json({
      models: models.map((model: any) => ({
        id: model.name,
        name: model.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching Ollama models:", error);

    // Return some default models if the API call fails
    return NextResponse.json({
      models: [
        { id: "llama3.2", name: "Llama 3.2" },
        { id: "llama3", name: "Llama 3" },
        { id: "mistral", name: "Mistral" },
        { id: "gemma", name: "Gemma" },
      ],
    });
  }
}
