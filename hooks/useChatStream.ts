import { useState } from "react";
import { chatStream } from "@/lib/api";

export function useChatStream(userId: string) {
  const [messages, setMessages] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function sendMessage(q: string) {
    setMessages(""); // Reset messages for new query
    setIsStreaming(true);

    try {
      await chatStream(q, userId, (chunk) => {
        // This callback is called for every chunk received
        setMessages((prev) => prev + chunk);
      });
    } catch (error) {
      console.error("Error streaming chat:", error);
      setMessages("Error: Failed to get response");
    } finally {
      setIsStreaming(false);
    }
  }

  return { messages, sendMessage, isStreaming };
}