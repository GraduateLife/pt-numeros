import { QuestionType } from "@/lib/question.util";

import { settingsStorage } from "@/app/storage/settings";
import { Question } from "@/lib/question.util";
import { speak } from "@/lib/speak";
import { GameMode } from "./constants";
import { GameSettings } from "./GameSettingDialog";

const STORAGE_KEY = "number-game-settings";
const LIVES_KEY = "number-game-lives";
export const defaultSettings: GameSettings = {
  general: {
    minNumber: 0,
    maxNumber: 100,
    defaultInstantCheckMode: false,
  },
  [GameMode.OneByOne]: {
    timeLimit: 10,
  },
  [GameMode.TillCrash]: {
    timeLimit: 10,
    lives: 3,
  },
  [GameMode.Timed]: {
    timeLimit: 60,
  },
};

export type GameClass = typeof LetsPlayNumberGame;

export class LetsPlayNumberGame {
  static allowedGameModes: GameMode[] = [
    GameMode.OneByOne,
    GameMode.TillCrash,
    GameMode.Timed,
  ];
  static gameSlug = "number-game";
  static settingKey = STORAGE_KEY;
  static livesKey = LIVES_KEY;
  static defaultSettings: GameSettings = defaultSettings;

  static isAnswerCorrect = (userInput: string, answer: string): boolean => {
    return Number.parseInt(userInput) === Number.parseInt(answer);
  };

  static async generateQuestion(): Promise<Question> {
    const settings = settingsStorage.getSettings(
      LetsPlayNumberGame.settingKey,
      LetsPlayNumberGame.defaultSettings,
    );
    const minNumber = settings.general.minNumber;
    const maxNumber = settings.general.maxNumber;
    const willSay = (
      Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
    ).toString();
    speak(willSay);

    return {
      questionId: crypto.randomUUID(),
      questionText: "你听到的数字是多少?",
      referenceAnswer: willSay,
      questionType: QuestionType.FillLimited,
      questionHint: "",
      extraResource: "",
    };
  }
}

// function isAnswerCorrect(userInput: string, answer: string): boolean {
//   return Number.parseInt(userInput) === Number.parseInt(answer);
// }

// async function generateQuestion(
//   minNumber: number,
//   maxNumber: number,
// ): Promise<Question> {
//   const willSay = (
//     Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
//   ).toString();
//   speak(willSay);

//   return {
//     questionId: crypto.randomUUID(),
//     questionText: "你听到的数字是多少?",
//     referenceAnswer: willSay,
//     questionType: QuestionType.FillLimited,
//     questionHint: "",
//     extraResource: "",
//   };
// }
