"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ModelSelector, { type ModelId } from "./ModelSelector";
import {
  loadChatHistory,
  clearChatHistory,
  usePersistMessages,
} from "@/hooks/useChatHistory";

export default function ChatWindow() {
  const [model, setModel] = useState<ModelId>("openai/gpt-4o");
  const [input, setInput] = useState("");
  const [initialMessages] = useState(() => loadChatHistory());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transport = useRef(
    new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ model }),
    })
  );

  // Re-create transport when model changes
  useEffect(() => {
    transport.current = new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ model }),
    });
  }, [model]);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: transport.current,
    messages: initialMessages,
  });

  // Persist messages to localStorage
  usePersistMessages(messages);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 5 * 24; // ~5 lines
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }, [input]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || status !== "ready") return;
    sendMessage({ text });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, status, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="relative z-10 flex flex-col h-dvh max-w-2xl mx-auto w-full px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-3 flex-shrink-0">
        <div>
          <h1
            className="text-lg sm:text-xl font-semibold tracking-widest text-[#e8e0f0] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Echoes
          </h1>
          <p className="text-[10px] text-[#8070a0] tracking-[0.2em] uppercase">
            of the void
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ModelSelector value={model} onChange={setModel} />
          <button
            onClick={handleClear}
            title="Clear echoes"
            className="p-2 rounded-lg text-[#8070a0] hover:text-[#ff00aa] hover:bg-[#1a0533]/60
                       transition-colors border border-transparent hover:border-[rgba(255,0,170,0.2)]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.2)] to-transparent flex-shrink-0" />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-8 gap-4"
          >
            <div className="text-4xl">✦</div>
            <p
              className="text-[#8070a0] text-sm tracking-wide leading-relaxed"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              The void awaits your voice.
              <br />
              Speak, and the cosmos shall echo.
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
            />
          ))}
        </AnimatePresence>

        {/* Submitted / thinking indicator */}
        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 text-[#00f5ff]/60 text-xs"
          >
            <span className="streaming-cursor">▋</span>
            <span
              className="tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              The void stirs…
            </span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — fixed bottom, safe area aware */}
      <div
        className="flex-shrink-0 pb-[env(safe-area-inset-bottom,12px)] pt-2"
      >
        <div
          className="flex items-end gap-2 bg-[#0d0015]/70 backdrop-blur-md border border-[rgba(0,245,255,0.15)]
                     rounded-2xl px-3 py-2 shadow-[0_0_40px_rgba(0,245,255,0.05)]"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready"}
            placeholder="Speak into the void…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#e8e0f0] placeholder:text-[#8070a0]/60
                       focus:outline-none leading-6 py-1 max-h-[120px] overflow-y-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || status !== "ready"}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#00f5ff]/20 to-[#7c3aed]/20
                       border border-[rgba(0,245,255,0.3)] text-[#00f5ff] flex items-center justify-center
                       disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[rgba(0,245,255,0.15)]
                       transition-colors"
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-[#8070a0]/40 mt-1.5 tracking-wider">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
