"use client";

import GameEndScreen from "@/components/NumberGame/GameEndScreen";
import GamePlayingScreen, {
  isAnswerCorrect,
} from "@/components/NumberGame/GamePlayingScreen";
import GameWaitingToStartScreen from "@/components/NumberGame/GameWaitingToStartScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { speak } from "@/lib/speak";
import { useLayoutEffect, useState } from "react";

export type IPracticeMode = "one-by-one" | "till-crash" | "timed";

const generateNumber = () => {
  return Math.floor(Math.random() * 200);
};

export type AnswerResult = {
  q: number;
  a: number;
  isCorrect: boolean;
};

export default function NumberGame() {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<
    "playing" | "waiting-to-start" | "end"
  >("waiting-to-start");
  const [roundCount, setRoundCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [givenSeconds, setGivenSeconds] = useState(999);

  const PracticeOneByOne = {
    onGameStart: () => {
      setRoundCount((prev) => prev + 1);
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      speak(newNumber.toString());
    },
    onAnswerCorrect: () => {
      setGameStatus("end");
      setCorrectCount((prev) => prev + 1);
    },
    onAnswerWrong: () => {
      setGameStatus("end");
    },
    onGameEnd: () => {
      setGameStatus("waiting-to-start");
      setRoundCount(0);
      setCorrectCount(0);
    },
  };
  const PracticeTillCrash = {
    onGameStart: () => {
      setRoundCount((prev) => prev + 1);
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      speak(newNumber.toString());
    },
    onAnswerCorrect: () => {
      setCorrectCount((prev) => prev + 1);
      PracticeTillCrash.onGameStart();
    },
    onAnswerWrong: () => {
      setGameStatus("end");
    },
    onGameEnd: () => {
      setGameStatus("waiting-to-start");
      setRoundCount(0);
      setCorrectCount(0);
    },
  };
  const PracticeTimed = {
    onGameStart: () => {
      setRoundCount(0);
      setCorrectCount(0);

      setRoundCount((prev) => prev + 1);
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      speak(newNumber.toString());
    },
    onAnswerCorrect: () => {
      setCorrectCount((prev) => prev + 1);
      setRoundCount((prev) => prev + 1);
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      speak(newNumber.toString());
    },
    onAnswerWrong: () => {
      setRoundCount((prev) => prev + 1);
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      speak(newNumber.toString());
    },
    onGameEnd: () => {
      setGameStatus("waiting-to-start");
      setRoundCount(0);
      setCorrectCount(0);
      localStorage.clear();
    },
  };

  const [practiceModeKey, setPracticeModeKey] =
    useState<IPracticeMode>("one-by-one");

  const possiblePracticeModes = {
    "one-by-one": PracticeOneByOne,
    "till-crash": PracticeTillCrash,
    timed: PracticeTimed,
  } as const;

  const PracticeMode = possiblePracticeModes[practiceModeKey];

  useLayoutEffect(() => {
    if (practiceModeKey === "timed") {
      setGivenSeconds(10 * 60);
    } else if (practiceModeKey === "one-by-one") {
      setGivenSeconds(10);
    } else if (practiceModeKey === "till-crash") {
      setGivenSeconds(10);
    }
  }, [practiceModeKey]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Card className="max-w-md mx-auto relative">
        <CardHeader>
          <CardTitle className="text-center">葡萄牙语数字专项练习</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span>听力练习</span>
          </div>
          {gameStatus === "waiting-to-start" && (
            <GameWaitingToStartScreen
              emitStartSignal={(mode) => {
                switch (mode) {
                  case "one-by-one":
                    setPracticeModeKey("one-by-one");
                    PracticeMode.onGameStart();
                    break;
                  case "till-crash":
                    setPracticeModeKey("till-crash");
                    PracticeMode.onGameStart();
                    break;
                  case "timed":
                    setPracticeModeKey("timed");
                    PracticeMode.onGameStart();
                    break;
                  default:
                    throw new Error("Invalid practice mode");
                }
              }}
            />
          )}

          {gameStatus === "playing" && (
            <GamePlayingScreen
              // do not need to re-render countdown component when timed mode
              key={practiceModeKey === "timed" ? undefined : roundCount}
              mode={practiceModeKey}
              givenSeconds={givenSeconds}
              roundCount={roundCount}
              currentNumber={currentNumber}
              emitGameEnd={() => {
                if (practiceModeKey === "timed") {
                  localStorage.setItem(
                    "Q" + roundCount,
                    currentNumber.toString() +
                      "?" +
                      "GIVEUP" +
                      "?" +
                      isAnswerCorrect(userInput, currentNumber),
                  );
                }
                setUserInput("");
                setGameStatus("end");
              }}
              emitAnswerSignal={(isCorrect) => {
                if (isCorrect) {
                  PracticeMode.onAnswerCorrect();
                } else {
                  PracticeMode.onAnswerWrong();
                }
              }}
              emitUserInput={(input) => {
                setUserInput(input);
              }}
            />
          )}

          {gameStatus === "end" && (
            <GameEndScreen
              mode={practiceModeKey}
              roundCount={roundCount}
              correctCount={correctCount}
              currentNumber={currentNumber}
              userInput={userInput}
              onNext={PracticeMode.onGameStart}
              onEnd={PracticeMode.onGameEnd}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
