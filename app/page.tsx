"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameEndScreen from "@/components/NumberGame/GameEndScreen";
import GamePlayingScreen from "@/components/NumberGame/GamePlayingScreen";
import GameWaitingToStartScreen from "@/components/NumberGame/GameWaitingToStartScreen";
import { speak } from "@/lib/speak";

const generateNumber = () => {
  return Math.floor(Math.random() * 200);
};

export default function NumberGame() {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<
    "playing" | "waiting-to-start" | "end"
  >("waiting-to-start");
  const [roundCount, setRoundCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [givenSeconds, setGivenSeconds] = useState(10);
  const PracticeOneByOne = {
    onGameStart: () => {
      setGameStatus("playing");
      const newNumber = generateNumber();
      setCurrentNumber(newNumber);
      setGivenSeconds(10);
      speak(newNumber.toString());
    },
    onAnswerCorrect: () => {
      setCorrectCount((prev) => prev + 1);
      setRoundCount((prev) => prev + 1);
      PracticeOneByOne.onGameStart();
    },
    onAnswerWrong: () => {
      setGameStatus("end");
      setRoundCount((prev) => prev + 1);
    },
    onGameEnd: () => {
      setGameStatus("waiting-to-start");
      setRoundCount(0);
      setCorrectCount(0);
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Card className="max-w-md mx-auto relative">
        <CardHeader>
          <CardTitle className="text-center">葡萄牙语数字练习</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameStatus === "waiting-to-start" && (
            <GameWaitingToStartScreen onStart={PracticeOneByOne.onGameStart} />
          )}

          {gameStatus === "playing" && (
            <GamePlayingScreen
              givenSeconds={givenSeconds}
              roundCount={roundCount}
              currentNumber={currentNumber}
              emitAnswerSignal={(isCorrect) => {
                if (isCorrect) {
                  PracticeOneByOne.onAnswerCorrect();
                } else {
                  PracticeOneByOne.onAnswerWrong();
                }
              }}
              emitUserInput={(input) => {
                setUserInput(input);
              }}
            />
          )}

          {gameStatus === "end" && (
            <GameEndScreen
              roundCount={roundCount}
              correctCount={correctCount}
              currentNumber={currentNumber}
              userInput={userInput}
              onNext={PracticeOneByOne.onGameStart}
              onEnd={PracticeOneByOne.onGameEnd}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
