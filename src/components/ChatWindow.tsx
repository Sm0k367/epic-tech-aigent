"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Trash2, Settings } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { UIMessage } from "@ai-sdk/react";
import {
  loadChatHistory,
  clearChatHistory,
  usePersistMessages,
} from "@/hooks/useChatHistory";

type Settings = {
  theme: "cosmic" | "cyber" | "minimal";
  tone: "orchestrator" | "cinematic" | "fun" | "concise";
  verbosity: "high" | "medium" | "low";
  model: string;
  backgroundIntensity: number;
  customPersona: string;
};

const DEFAULT_SETTINGS: Settings = {
  theme: "cosmic",
  tone: "orchestrator",
  verbosity: "medium",
  model: "groq/llama-3.3-70b",
  backgroundIntensity: 1.0,
  customPersona: "",
};

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [initialMessages] = useState<UIMessage[]>(() => loadChatHistory());
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("epic-tech-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("epic-tech-settings", JSON.stringify(settings));
  }, [settings]);

  const transport = new DefaultChatTransport({ api: "/api/chat" });

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initialMessages,
  });

  usePersistMessages(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
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
    if (typeof window !== "undefined") window.location.reload();
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="relative z-10 flex flex-col h-dvh max-w-2xl mx-auto w-full px-3 sm:px-4">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between pt-4 pb-3 flex-shrink-0">
        <div>
          <h1
            className="text-lg sm:text-xl font-semibold tracking-widest text-[#e8e0f0] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            EPIC TECH A.I.
          </h1>
          <p className="text-[10px] text-[#8070a0] tracking-[0.2em] uppercase">
            PROJECT ORCHESTRATOR
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-[#8070a0] hover:text-[#00f5ff] hover:bg-[#1a0533]/60 transition-colors"
            title="Customize AI"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleClear}
            title="Clear session"
            className="p-2 rounded-lg text-[#8070a0] hover:text-[#ff00aa] hover:bg-[#1a0533]/60 transition-colors border border-transparent hover:border-[rgba(255,0,170,0.2)]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-[#0d0015]/90 border border-[rgba(0,245,255,0.2)] rounded-2xl text-sm">
          <h3 className="font-semibold mb-3 text-[#00f5ff]">Customization Panel</h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8070a0] mb-1">Theme</label>
              <select 
                value={settings.theme}
                onChange={(e) => updateSetting("theme", e.target.value)}
                className="w-full bg-[#1a0533] border border-[#00f5ff]/30 rounded px-3 py-1 text-[#e8e0f0]"
              >
                <option value="cosmic">Cosmic</option>
                <option value="cyber">Cyberpunk</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8070a0] mb-1">Tone</label>
              <select 
                value={settings.tone}
                onChange={(e) => updateSetting("tone", e.target.value)}
                className="w-full bg-[#1a0533] border border-[#00f5ff]/30 rounded px-3 py-1 text-[#e8e0f0]"
              >
                <option value="orchestrator">Orchestrator</option>
                <option value="cinematic">Cinematic</option>
                <option value="fun">Fun</option>
                <option value="concise">Concise</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8070a0] mb-1">Verbosity</label>
              <select 
                value={settings.verbosity}
                onChange={(e) => updateSetting("verbosity", e.target.value)}
                className="w-full bg-[#1a0533] border border-[#00f5ff]/30 rounded px-3 py-1 text-[#e8e0f0]"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8070a0] mb-1">Model</label>
              <select 
                value={settings.model}
                onChange={(e) => updateSetting("model", e.target.value)}
                className="w-full bg-[#1a0533] border border-[#00f5ff]/30 rounded px-3 py-1 text-[#e8e0f0]"
              >
                <option value="groq/llama-3.3-70b">Llama 3.3 70B (Fast)</option>
                <option value="openai/gpt-4o">GPT-4o</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#8070a0] mb-1 text-xs">Background Intensity</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={settings.backgroundIntensity}
              onChange={(e) => updateSetting("backgroundIntensity", parseFloat(e.target.value))}
              className="w-full accent-[#00f5ff]"
            />
          </div>

          <div className="mt-4">
            <label className="block text-[#8070a0] mb-1 text-xs">Custom Persona Override</label>
            <textarea
              value={settings.customPersona}
              onChange={(e) => updateSetting("customPersona", e.target.value)}
              placeholder="Override the AI's behavior here..."
              className="w-full h-20 bg-[#0a0011] border border-[#00f5ff]/30 rounded p-3 text-xs text-[#e8e0f0] resize-y"
            />
          </div>

          <button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="mt-4 text-xs text-[#ff00aa] hover:text-red-400 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.2)] to-transparent flex-shrink-0" />

      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-8 gap-4"
          >
            <div className="text-4xl">⚡</div>
            <p className="text-[#8070a0] text-sm tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-cinzel)" }}>
              EPIC TECH A.I. ONLINE.<br />
              PROJECT ORCHESTRATOR MODE ENGAGED.
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

        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 text-[#00f5ff]/60 text-xs"
          >
            <span className="streaming-cursor">▋</span>
            <span className="tracking-widest uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              EXECUTING AT MAXIMUM VELOCITY...
            </span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 pb-[env(safe-area-inset-bottom,12px)] pt-2">
        <div className="flex items-end gap-2 bg-[#0d0015]/70 backdrop-blur-md border border-[rgba(0,245,255,0.15)] rounded-2xl px-3 py-2 shadow-[0_0_40px_rgba(0,245,255,0.05)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready"}
            placeholder="Command the AI..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#e8e0f0] placeholder:text-[#8070a0]/60 focus:outline-none leading-6 py-1 max-h-[120px] overflow-y-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || status !== "ready"}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#00f5ff]/20 to-[#7c3aed]/20 border border-[rgba(0,245,255,0.3)] text-[#00f5ff] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[rgba(0,245,255,0.15)] transition-colors"
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
