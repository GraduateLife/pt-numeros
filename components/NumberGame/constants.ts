export enum GameMode {
  OneByOne = "oneByOne",
  TillCrash = "tillCrash",
  Timed = "timed",
}

export enum GameModeParam {
  OneByOne = "one-by-one",
  TillCrash = "till-crash",
  Timed = "timed",
}

/**
 * Converts a string to kebab-case
 * @example
 * toKebabCase('camelCase') // 'camel-case'
 * toKebabCase('PascalCase') // 'pascal-case'
 * toKebabCase('snake_case') // 'snake-case'
 * toKebabCase('some text') // 'some-text'
 */
export function toKebabCase(str: string): string {
  return (
    str
      // Handle camelCase and PascalCase
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Handle PascalCase consecutive capitals (e.g., XMLHttpRequest)
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Convert to lowercase
      .toLowerCase()
  );
}

export const GameModeZh = {
  [GameMode.OneByOne]: "先来一题",
  [GameMode.TillCrash]: "Forge模式",
  [GameMode.Timed]: "计时答题",
} as const;
