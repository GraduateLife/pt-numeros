"use client";

import { ChatScreen } from "@/components/Chat/ChatScreen";
import { ChatSettingDisplay } from "../../components/Chat/ChatSettingDisplay";
import { SelectedTextProvider } from "../../components/Chat/SelectedTextContext";
import { SelectedTextDisplay } from "../../components/Chat/SelectedTextDisplay";
export default function ChatPage() {
  return (
    <SelectedTextProvider>
      <div className="flex h-svh">
        <div className="w-[300px] border-r bg-gray-100">
          <SelectedTextDisplay />
        </div>
        <div className="flex-1">
          <ChatScreen />
        </div>
        <div className="w-[300px] border-l bg-gray-100">
          <ChatSettingDisplay />
        </div>
      </div>
    </SelectedTextProvider>
  );
}
