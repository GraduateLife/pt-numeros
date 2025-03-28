import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { word: string } },
) {
  const _params = await params;
  const { word } = _params;

  try {
    // First check if the word exists
    const existsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/exists/${word}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const existsData = await existsResponse.json();

    if (!existsData.exists) {
      return NextResponse.json({
        word,
        error: "Word does not exist in the database",
      });
    }

    // If word exists, fetch its forma
    const formaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/forma/${word}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await formaResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
