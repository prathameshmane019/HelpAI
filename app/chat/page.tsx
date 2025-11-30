"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStream } from "@/hooks/useChatStream";
import { getChatHistory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const userId = "customer@demo.com";

  const { messages: streamMsg, sendMessage, isStreaming } = useChatStream(userId);

  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Load old chat messages on first mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory(userId);
        setChatLog(history);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    }
    loadHistory();
  }, [userId]);

  // Handle incoming streaming chunks
  useEffect(() => {
    if (streamMsg === null) return;

    setChatLog((prev) => {
      const updated = [...prev];

      if (
        updated.length &&
        updated[updated.length - 1].role === "assistant"
      ) {
        updated[updated.length - 1].content = streamMsg;
        return updated;
      }

      return updated;
    });
  }, [streamMsg]);

  // Auto-scroll
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [chatLog, streamMsg]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const text = input.trim();
    setInput("");

    setChatLog((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" }
    ]);

    await sendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto ">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png" 
              alt="HelpAI Logo" 
              height={150}
              width={150}
              className="object-contain"
            /> 
          </div>
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="h-full max-w-5xl mx-auto px-4 py-6 overflow-y-auto"
        >
          {chatLog.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Image src="/logo.png" alt="HelpAI Logo" height={150} width={150}className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to HelpAI
              </h2>
              <p className="text-gray-500">
                Start a conversation by typing a message below
              </p>
            </div>
          )}

          <AnimatePresence>
            {chatLog.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "user" 
                      ? "bg-primary" 
                      : "bg-gradient-to-br from-blue-400 to-blue-600"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium ${
                      msg.role === "user" ? "text-right text-gray-600" : "text-gray-600"
                    }`}>
                      {msg.role === "user" ? "You" : "Assistant"}
                    </span>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-secondary-foreground border border-gray-200 rounded-tl-sm"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: (props) => (
                            <p {...props} className="leading-relaxed mb-2 last:mb-0" />
                          ),
                          code: (props) => (
                            <code
                              {...props}
                              className={`rounded px-1.5 py-0.5 text-sm font-mono ${
                                msg.role === "user" 
                                  ? "bg-primary/80 text-primary-foreground" 
                                  : "bg-muted text-muted-foreground"
                              }`}
                            />
                          ),
                          pre: (props) => (
                            <pre
                              {...props}
                              className={`rounded-lg p-4 overflow-auto text-sm my-2 ${
                                msg.role === "user"
                                  ? "bg-primary/80"
                                  : "bg-muted"
                              }`}
                            />
                          ),
                          ul: (props) => (
                            <ul {...props} className="list-disc list-inside space-y-1 my-2" />
                          ),
                          ol: (props) => (
                            <ol {...props} className="list-decimal list-inside space-y-1 my-2" />
                          ),
                          li: (props) => (
                            <li {...props} className="leading-relaxed" />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* INPUT BOX */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message here..."
              disabled={isStreaming}
              className="flex-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="h-12 w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}