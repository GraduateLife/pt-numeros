"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Message, useChat } from "@ai-sdk/react";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./ChatBubble";

const ChatHeader = () => {
  return (
    <header className="m-auto h-full flex max-w-96 flex-col gap-5 justify-center items-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Basic AI Chatbot Template
      </h1>
      <p className="text-muted-foreground text-sm">
        This is an AI chatbot app template built with{" "}
        <span className="text-foreground">Next.js</span>, the{" "}
        <span className="text-foreground">Vercel AI SDK</span>, and{" "}
        <span className="text-foreground">Vercel KV</span>.
      </p>
      <p className="text-muted-foreground text-sm">
        Connect an API Key from your provider and send a message to get started.
      </p>
    </header>
  );
};

export function ChatScreen({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/chat-history");
        const data = await response.json();

        if (data.messages && Array.isArray(data.messages)) {
          console.log("Loaded chat history:", data.messages);
          setInitialMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      custom: "please respond in portuguese",
    },
    initialMessages: initialMessages,
  });

  // Save messages when they change
  useEffect(() => {
    const saveChatHistory = async () => {
      // Don't save if we're still loading initial messages or if there are no messages
      if (isLoading || messages.length === 0) {
        return;
      }

      try {
        console.log("Saving chat history:", messages);
        await fetch("/api/chat-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        });
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    };

    saveChatHistory();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const messageList = (
    <div className="flex flex-col h-full overflow-y-auto p-4 ">
      <div className="flex flex-col gap-4 py-4">
        {messages.map((message, idx) => {
          return (
            <div key={message.id}>
              {idx === messages.length - 1 && status === "streaming" && (
                <div className="flex items-center gap-2 my-3">
                  <div className="size-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="size-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="size-1 bg-gray-100 rounded-full animate-bounce"></div>
                </div>
              )}
              <ChatBubble message={message} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center text-xs text-muted-foreground">
        {status === "error" && "Error"}
      </div>
    </div>
  );

  return (
    <main
      className={cn(
        "pt-4 flex h-svh max-h-svh w-full max-w-[60vw] flex-col items-stretch border-none bg-white",
        className,
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#aaa #fff",
      }}
      {...props}
    >
      <div className="flex-1 overflow-hidden px-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex items-center gap-2">
              <div className="size-3 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="size-2.5 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="size-2 bg-gray-100 rounded-full animate-bounce"></div>
              <span className="ml-2 text-gray-500">
                Loading chat history...
              </span>
            </div>
          </div>
        ) : messages.length ? (
          messageList
        ) : (
          <ChatHeader />
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-6 border-input  bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
      >
        <textarea
          onKeyDown={handleKeyDown}
          value={input}
          ref={textareaRef}
          rows={1}
          onChange={(e) => {
            handleInputChange(e);
            resizeTextarea();
          }}
          className={cn(
            "resize-none min-h-4 max-h-80",
            "placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none",
            className,
          )}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-1 right-1 size-6 rounded-full"
              >
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </main>
  );
}
