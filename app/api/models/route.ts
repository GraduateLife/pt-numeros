import { NextResponse } from "next/server";

export async function GET() {
  console.log("process.env.OLLAMA_HOST", process.env.OLLAMA_HOST);
  // Call the Ollama API to list models
  const response = await fetch(`${process.env.OLLAMA_HOST}/api/tags`, {
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
  console.log("models", models);
  return NextResponse.json({
    models: models.map((model: any) => ({
      id: model.name,
      name: model.name,
    })),
  });
}
