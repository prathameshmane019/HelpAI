// components/ChatMessage.tsx

import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
}

const roleLabel: Record<ChatMessageProps["role"], string> = {
  user: "You",
  assistant: "AI",
  system: "System",
};

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      className={`flex mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
          isSystem
            ? "bg-gray-200 text-gray-800"
            : isUser
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="text-[10px] uppercase tracking-wide mb-1 opacity-70">
          {roleLabel[role]}
        </div>
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
