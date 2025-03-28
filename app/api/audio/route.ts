import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const audioResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/audio/text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      },
    );

    if (!audioResponse.ok) {
      throw new Error(`HTTP error! status: ${audioResponse.status}`);
    }

    // Get the audio data as an ArrayBuffer
    const audioData = await audioResponse.arrayBuffer();

    // Return the audio file with appropriate headers
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": `attachment; filename="speech.wav"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 },
    );
  }
}
