"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "@ai-sdk/react";

const STORAGE_KEY = "echoes-chat-history";

export function loadChatHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as UIMessage[];
  } catch {
    // ignore
  }
  return [];
}

export function saveChatHistory(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function usePersistMessages(messages: UIMessage[]): void {
  const prevLengthRef = useRef(0);
  useEffect(() => {
    if (messages.length !== prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      saveChatHistory(messages);
    }
  }, [messages]);
}
