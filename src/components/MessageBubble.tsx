"use client";

import { motion } from "framer-motion";
import type { UIMessage } from "ai";

interface MessageBubbleProps {
  message: UIMessage;
  isStreaming?: boolean;
}

function getTextContent(message: UIMessage): string {
  const textParts = message.parts.filter((p) => p.type === "text");
  if (textParts.length > 0) {
    return textParts.map((p) => (p.type === "text" ? p.text : "")).join("");
  }
  return "";
}

export default function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text = getTextContent(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* Avatar dot for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#00f5ff]/30 to-[#ff00aa]/30 border border-[rgba(0,245,255,0.3)] flex items-center justify-center mr-2 mt-1">
          <span className="text-[9px] text-[#00f5ff] font-bold select-none">✦</span>
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "max-w-[65%]" : ""}`}>
        {/* Role label */}
        <div
          className={`text-[10px] font-medium mb-1 tracking-widest uppercase ${
            isUser ? "text-right text-[#8070a0]" : "text-[#00f5ff]/60"
          }`}
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          {isUser ? "You" : "Echo"}
        </div>

        {/* Bubble */}
        <div
          className={
            isUser
              ? `bg-[#1a0533]/90 border border-[rgba(124,58,237,0.4)] text-white
                 rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed
                 shadow-[0_0_20px_rgba(124,58,237,0.15)]`
              : `bg-[#0d0015]/80 border border-[rgba(0,245,255,0.2)] text-[#e8e0f0]
                 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed
                 shadow-[0_0_24px_rgba(0,245,255,0.08)] backdrop-blur-sm`
          }
        >
          <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>
          {isStreaming && !isUser && (
            <span className="streaming-cursor ml-0.5">▋</span>
          )}
        </div>
      </div>

      {/* Avatar dot for user */}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed]/40 to-[#1a0533] border border-[rgba(124,58,237,0.3)] flex items-center justify-center ml-2 mt-1">
          <span className="text-[9px] text-[#c4b8d8] font-bold select-none">◈</span>
        </div>
      )}
    </motion.div>
  );
}
