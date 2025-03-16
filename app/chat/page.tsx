import { ChatScreen } from "@/components/Chat/ChatScreen";

export default function ChatPage() {
  return (
    <div className="flex h-svh">
      <div className="flex-1 bg-red-500"></div>
      <ChatScreen />
      <div className="flex-1 bg-blue-500"></div>
    </div>
  );
}
