import { Gender } from "@/lib/utils";
import { NextResponse } from "next/server";

interface RawDefinition {
  category: string;
  definitions: string[];
}

interface ApiResponse {
  word: string;
  definitions: RawDefinition[];
  error: string | null;
}

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

    // If word exists, fetch its definition
    const definitionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/definition/${word}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const rawData: ApiResponse = await definitionResponse.json();

    // Extract gender from the first definition's category
    const categories = rawData.definitions.map((def) => {
      return def.category;
    });

    const processWordGender = (categories: string[]) => {
      if (
        categories.includes("nome masculino") &&
        categories.includes("nome feminino")
      ) {
        return Gender.Both;
      }
      if (categories.includes("nome masculino")) {
        return Gender.Masculino;
      }
      if (categories.includes("nome feminino")) {
        return Gender.Feminino;
      }
      if (categories.includes("nome de dois géneros")) {
        return Gender.TwoGender;
      }
      return null;
    };

    const gender = processWordGender(categories);

    if (!gender) {
      return NextResponse.json({
        word,
        error: "Not a nome",
      });
    }
    return NextResponse.json({
      word: rawData.word,
      gender,
      error: null,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gender" },
      { status: 500 },
    );
  }
}
