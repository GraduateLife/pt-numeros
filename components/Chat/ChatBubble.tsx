import { useSelectedText } from "@/components/Chat/SelectedTextContext";
import { cn } from "@/lib/utils";
import { Message } from "ai";
import { format } from "date-fns";
import { Copy, Loader2, Volume1, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Maximum characters per chunk for text-to-speech
const MAX_CHUNK_LENGTH = 1000;

const splitTextIntoChunks = (text: string): string[] => {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentences (roughly)
  const sentences = text.split(/([.!?。！？]+\s+)/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= MAX_CHUNK_LENGTH) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

export const ChatBubble = ({ message }: { message: Message }) => {
  const { setSelectedText } = useSelectedText();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已复制到剪贴板");
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex",
          message.role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          data-role={message.role}
          className={cn(
            "max-w-[60%] select-auto selection:bg-violet-500 selection:text-white px-3 py-2 text-sm break-words whitespace-pre-wrap rounded-lg group relative",
            message.role === "user"
              ? "rounded-tr-none bg-blue-500 text-white"
              : "rounded-tl-none bg-gray-100 text-black",
          )}
          onMouseUp={handleSelection}
        >
          {message.content}
          <div className="flex w-full">
            <span
              className={cn(
                "text-xs select-none",
                message.role === "user"
                  ? "ml-auto text-gray-300"
                  : "mr-auto text-gray-500",
              )}
            >
              {message.createdAt ? format(message.createdAt, "HH:mm") : ""}
            </span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex max-w-[60%] gap-x-2",
          message.role === "user" ? "hidden self-end" : "self-start",
        )}
      >
        <button
          onClick={() => copyToClipboard(message.content)}
          className="opacity-10 hover:opacity-100 transition-opacity"
          title="Copy message"
        >
          <Copy className="h-4 w-4 text-gray-400" />
        </button>
        {/* <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={cn(
            "opacity-10 hover:opacity-100 transition-opacity",
            isPlaying && "opacity-100",
          )}
          title={isPlaying ? "Stop" : "Play message"}
        >
          {isPlaying ? (
            <>
              {iconToggle ? (
                <Volume2
                  className={cn(
                    "h-4 w-4 ",
                    isPlaying ? "text-green-400" : "text-gray-400",
                  )}
                />
              ) : (
                <Volume1
                  className={cn(
                    "h-4 w-4 ",
                    isPlaying ? "text-green-400" : "text-gray-400",
                  )}
                />
              )}
            </>
          ) : (
            <Volume2 className="h-4 w-4 text-gray-400" />
          )}
        </button> */}
        <PlayingButton text={message.content} />
      </div>
    </div>
  );
};

type PlayingStatus = "loading" | "playing" | "paused" | "idle";

const PlayingButton = ({ text }: { text: string }) => {
  const [iconToggle, setIconToggle] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<PlayingStatus>("idle");
  const playAudioChunks = async (text: string) => {
    if (currentStatus === "playing") return;
    setCurrentStatus("loading");

    try {
      const response = await fetch("/api/audio", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      await new Promise((resolve, reject) => {
        const audio = new Audio(url);
        setCurrentStatus("playing");
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };

        audio.onerror = reject;
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("播放音频时出错");
    } finally {
      setCurrentStatus("paused");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStatus === "playing") {
      interval = setInterval(() => {
        setIconToggle((prev) => !prev);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStatus]);

  if (currentStatus === "loading") {
    return <Loader2 className="size-4 animate-spin text-gray-400" />;
  }
  if (currentStatus === "playing") {
    return (
      <>
        {iconToggle ? (
          <Volume2 className={cn("h-4 w-4 ", "text-green-400")} />
        ) : (
          <Volume1 className={cn("h-4 w-4 ", "text-green-400")} />
        )}
      </>
    );
  }
  return (
    <button
      onClick={() => playAudioChunks(text)}
      className="opacity-10 hover:opacity-100 transition-opacity"
      title="Play message"
    >
      <Volume2 className="h-4 w-4 text-gray-400" />
    </button>
  );
};
