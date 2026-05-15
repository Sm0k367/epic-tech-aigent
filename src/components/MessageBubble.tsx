"use client";

import { motion } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export default function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text = message.parts.filter(p => p.type === "text").map(p => (p as {type:"text"; text:string}).text).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-[#1a0533]/80 border border-[rgba(0,245,255,0.15)] text-[#e8e0f0] rounded-br-sm"
            : "bg-[#0d0015]/60 border border-[rgba(168,85,247,0.15)] text-[#c4b8d8] rounded-bl-sm"
        }`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {text}
        {isStreaming && (
          <span className="streaming-cursor ml-0.5">▋</span>
        )}
      </div>
    </motion.div>
  );
}
