"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, TextSelect } from "lucide-react";
import { ReactNode, useState } from "react";
import { AutoResizeTextareaForm } from "./AutoResizeTextarea";

interface SearchComponentProps<T> {
  fetchUrl: string;
  placeholder?: string;
  submitButtonText?: string;
  submitButtonIcon?: ReactNode;
  ResultCard: React.ComponentType<{ result: T }>;
  LoadingCard?: React.ComponentType;
  transformSearchTerm?: (term: string) => string;
  queryKey: string;
}

async function fetchData<T>(url: string, searchTerm: string): Promise<T> {
  const response = await fetch(`${url}/${searchTerm}`, {
    method: "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch data");
  }

  return data;
}

export default function SearchComponent<T>({
  fetchUrl,
  placeholder = "Search",
  submitButtonText = "Search",
  submitButtonIcon = <Search size={16} />,
  ResultCard,
  LoadingCard,
  transformSearchTerm = (term: string) => term.trim().replace(/\s+/g, " "),
  queryKey,
}: SearchComponentProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: result,
    error,
    isLoading,
    refetch,
  } = useQuery<T>({
    queryKey: [queryKey, searchTerm],
    queryFn: () => fetchData<T>(fetchUrl, searchTerm),
    enabled: Boolean(searchTerm),
    retry: false,
  });

  const handleSubmit = async (value: string) => {
    const cleanedValue = transformSearchTerm(value);
    if (!cleanedValue) return;

    setSearchTerm(cleanedValue);
    await refetch();
  };

  const DefaultLoadingCard = () => (
    <div className="rounded-lg border bg-card px-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );

  const LoadingComponent = LoadingCard || DefaultLoadingCard;

  return (
    <div className="h-[var(--search-component-height)] flex flex-col rounded-b-lg p-2 border border-t-0 ">
      <AutoResizeTextareaForm
        placeholder={placeholder}
        emitSubmit={handleSubmit}
        submitButtonText={submitButtonText}
        submitButtonIcon={submitButtonIcon}
        isLoading={isLoading}
      />

      <div className="flex-1 mt-1">
        {isLoading && <LoadingComponent />}
        {result && <ResultCard result={result} />}
        {!isLoading && !result && (
          <div className=" h-full flex flex-col items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
            <TextSelect className="size-28 stroke-1 text-violet-300" />
            <span className="text-sm font-bold">
              输入你想搜索的词, 然后按下搜索按钮或者按下Enter
            </span>
          </div>
        )}
      </div>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        搜寻结果来源于{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://dicionario.priberam.org"
          className="text-[#ec008c]"
        >
          Dicionário Priberam
        </a>
      </span>
    </div>
  );
}
