"use client";

import { Gender } from "@/lib/utils";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import Link from "next/link";
import SearchComponent from "../Common/SearchComponent";

interface WordGenderResult {
  word: string;
  gender: Gender;
  error: string | null;
}

function getGenderDisplay(gender: Gender) {
  switch (gender) {
    case Gender.Masculino:
      return {
        label: "阳性",
        description: "这个单词是阳性词，使用冠词 o/um",
        className: "bg-blue-100 text-blue-700",
      };
    case Gender.Feminino:
      return {
        label: "阴性",
        description: "这个单词是阴性词，使用冠词 a/uma",
        className: "bg-pink-100 text-pink-700",
      };
    case Gender.Both:
      return {
        label: "根据上下文",
        description:
          "这个单词既可以是阳性词也可以是阴性词，根据上下文使用冠词 o/um 或 a/uma",
        className: "bg-purple-100 text-purple-700",
      };
    case Gender.TwoGender:
      return {
        label: "根据指代对象",
        description:
          "这个单词的形式不变，但根据指代对象的性别使用冠词 o/um 或 a/uma",
        className: "bg-violet-100 text-violet-700",
      };
  }
}

function WordGenderResultCard({ result }: { result: WordGenderResult }) {
  if (result.error) {
    const handleError = (result: WordGenderResult) => {
      if (result.error === "Word does not exist in the database") {
        return "这个单词很可能不存在";
      }
      if (result.error === "Not a nome") {
        return "这个单词不是名词";
      }
      return result.error;
    };
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-1">
        <div className="h-full flex flex-col items-center justify-between gap-2">
          <span className="text-sm text-destructive">
            没有找到单词"{result.word}"的性别, 因为{handleError(result)}.
          </span>
          <TriangleAlert className="flex-1 size-20 stroke-1 text-destructive" />
          <span className="flex items-center justify-center text-sm text-destructive">
            <Link
              href={`https://dicionario.priberam.org/${result.word}`}
              className="text-amber-500"
            >
              查询原站
            </Link>
          </span>
        </div>
      </div>
    );
  }

  const genderInfo = getGenderDisplay(result.gender);

  return (
    <div className="rounded-lg border bg-card p-2 text-card-foreground shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{result.word}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-sm ${genderInfo.className}`}
          >
            {genderInfo.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {genderInfo.description}
        </p>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="h-full rounded-lg bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          等待获取单词性别...
        </span>
      </div>
    </div>
  );
}

export default function WordGenderSearch() {
  return (
    <SearchComponent<WordGenderResult>
      fetchUrl="/api/gender"
      placeholder="查询名词性别"
      submitButtonText="查询"
      submitButtonIcon={<Search size={16} />}
      ResultCard={WordGenderResultCard}
      LoadingCard={LoadingCard}
      queryKey="wordGender"
    />
  );
}
