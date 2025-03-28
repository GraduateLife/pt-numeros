import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { Loader2, Sparkle, X } from "lucide-react";
import { useEffect } from "react";
import { useSelectedText } from "./SelectedTextContext";

export const SelectedTextDisplay = () => {
  const { selectedText, isVisible, setIsVisible } = useSelectedText();

  useEffect(() => {
    if (selectedText) {
      appendTranslate({ role: "user", content: selectedText });
      messagesSimilarSentences.length = 0;
    }
  }, [selectedText]);

  const {
    append: appendSimilarSentences,
    status: statusSimilarSentences,
    messages: messagesSimilarSentences,
  } = useChat({
    api: "/api/similar-sentences",
    body: {
      text: selectedText,
    },
  });
  const {
    append: appendTranslate,
    status: statusTranslate,
    messages: messagesTranslate,
  } = useChat({
    api: "/api/translate/to-zh",
    body: {
      text: selectedText,
    },
  });

  if (!isVisible) {
    return (
      <div className="flex-1 p-4">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">不懂什么意思? 选中文本翻译!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 p-4 max-h-[99vh] overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#aaa #fff",
      }}
    >
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-violet-500 text-xs">
            来自Ai导师的教诲
            <Sparkle className="ml-1 size-2 inline-block fill-yellow-300 stroke-yellow-300" />
          </span>

          <Button
            onClick={() => setIsVisible(false)}
            size="icon"
            variant="ghost"
            className=" hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-4 text-gray-500" />
          </Button>
        </div>
        <h3 className="sr-only">你选中了以下内容:</h3>
        <p className="whitespace-pre-wrap line-clamp-2 mb-2 text-lg font-bold text-violet-500">
          {selectedText}
        </p>
        <div className="flex flex-col gap-2">
          {statusTranslate === "streaming" && <>正在翻译中</>}
          {statusTranslate === "ready" && messagesTranslate.length > 0 && (
            <div className=" p-2 bg-gray-50 rounded-lg">
              <h4 className="sr-only">翻译结果如下:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {messagesTranslate[messagesTranslate.length - 1].content}
              </p>
            </div>
          )}
          <Button
            onClick={() =>
              appendSimilarSentences({ role: "user", content: selectedText })
            }
            disabled={
              statusTranslate === "ready" &&
              statusSimilarSentences === "streaming"
            }
            className="w-full"
          >
            {statusSimilarSentences === "streaming" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在解读句子...
              </>
            ) : (
              "解读句子"
            )}
          </Button>
          {}
          {statusSimilarSentences === "ready" &&
            statusTranslate === "ready" &&
            messagesSimilarSentences.length > 0 && (
              <div
                className=" p-2 bg-gray-50 rounded-lg overflow-y-auto max-h-[520px]"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#aaa #fff",
                }}
              >
                <h4 className="sr-only">分析结果如下:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {
                    messagesSimilarSentences[
                      messagesSimilarSentences.length - 1
                    ].content
                  }
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
