"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MODELS = [
  { id: "openai/gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  {
    id: "anthropic/claude-3-5-sonnet",
    label: "Claude 3.5 Sonnet",
    provider: "Anthropic",
  },
  { id: "groq/llama-3.3-70b", label: "Llama 3.3 70B", provider: "Groq" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ModelId)}>
      <SelectTrigger
        className="w-52 bg-[#130020]/80 border-[rgba(0,245,255,0.2)] text-[#c4b8d8] text-xs
                   hover:border-[rgba(0,245,255,0.5)] transition-colors backdrop-blur-sm"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#130020] border-[rgba(0,245,255,0.2)]">
        {MODELS.map((m) => (
          <SelectItem
            key={m.id}
            value={m.id}
            className="text-[#c4b8d8] hover:bg-[#1a0533] focus:bg-[#1a0533] text-xs cursor-pointer"
          >
            <span className="font-medium">{m.label}</span>
            <span className="ml-1.5 opacity-50">· {m.provider}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
