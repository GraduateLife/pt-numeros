import { ArrowRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import SearchComponent from "../Common/SearchComponent";

interface WordResult {
  word: string;
  forma: string[];
  lemma: string;
  error: string | null;
}

function WordResultCard({ result }: { result: WordResult }) {
  if (result.error) {
    const handleError = (result: WordResult) => {
      if (result.error === "Word does not exist in the database") {
        return "这个单词很可能不存在";
      }
      return result.error;
    };
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2">
        <div className="h-full flex flex-col items-center justify-between gap-2">
          <span className="text-sm text-destructive">
            没有找到单词"{result.word}"的变形, 因为{handleError(result)}.
          </span>
          <span className="flex-1 flex items-center justify-center mr-4 text-sm text-destructive">
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

  return (
    <div className="rounded-lg border bg-card p-2 text-card-foreground shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold">{result.word}</span>
          <ArrowRight size={12} />
          <span className="bg-violet-400/10 px-1 rounded-md text-sm text-violet-400 text-muted-foreground">
            {result.lemma}
          </span>
        </div>
        <div className="space-y-1">
          <ul className="list-inside list-disc space-y-1">
            {result.forma.map((form, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {form.startsWith("lemma") ? `${result.lemma}的原型` : form}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="h-full rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          等待获取单词变形...
        </span>
      </div>
    </div>
  );
}

export default function WordFormaSearch() {
  return (
    <SearchComponent<WordResult>
      fetchUrl="/api/forma"
      placeholder="查询单词变化形式"
      submitButtonText="查询"
      submitButtonIcon={<Search size={16} />}
      ResultCard={WordResultCard}
      LoadingCard={LoadingCard}
      queryKey="wordData"
    />
  );
}
