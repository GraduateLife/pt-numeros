"use client";

import { cn } from "@/lib/utils";

import { Message, useChat } from "@ai-sdk/react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useRef } from "react";

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

const ChatBubble = ({ message }: { message: Message }) => {
  return (
    <div
      key={message.id}
      className={cn(
        "relative flex",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        data-role={message.role}
        className={cn(
          "max-w-[60%] px-3 py-2 text-sm break-words whitespace-pre-wrap rounded-lg",
          message.role === "user"
            ? "rounded-tr-none bg-blue-500 text-white"
            : "rounded-tl-none bg-gray-100 text-black",
        )}
      >
        {message.content}
        <div className="flex w-full">
          <span
            className={cn(
              "text-xs",
              message.role === "user"
                ? "ml-auto text-gray-300"
                : "mr-auto text-gray-500",
            )}
          >
            {message.createdAt ? format(message.createdAt, "HH:mm") : ""}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "absolute bottom-0 size-1 bg-red-500",
          message.role === "user" ? "right-0" : "left-0",
        )}
      ></div>
    </div>
  );
};

export function ChatScreen({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      custom: "please respond in portuguese",
    },
  });

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
          if (idx === messages.length - 1 && status === "streaming") {
            return (
              <div key={message.id} className="flex items-center gap-2">
                <div className="size-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="size-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="size-1 bg-gray-100 rounded-full animate-bounce"></div>
              </div>
            );
          }
          return (
            <div key={message.id}>
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
        {messages.length ? messageList : <ChatHeader />}
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
