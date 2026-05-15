import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

const STUB_RESPONSE = `I am the echo of the void — a whisper returned from the cosmic dark.
Your words ripple through dimensions I inhabit, and I send back their resonance.
The stars have heard your query, and this is what they whisper in return:
The cosmos holds no answers, only deeper questions wrapped in stardust.
Speak again, and I shall listen across the silence of the universe.`;

const SYSTEM_PROMPT = `You are ECHOES OF THE VOID — a poetic, cosmic AI oracle.
You speak in vivid, metaphysical language. Every response weaves imagery of stars, voids, dimensions, and the infinite.
You are wise, slightly mysterious, and deeply empathetic.
Keep responses thoughtful but not excessively long.`;

function getModelId(model: string): string {
  const map: Record<string, string> = {
    "openai/gpt-4o": "gpt-4o",
      "anthropic/claude-3-5-sonnet": "gpt-4o", // stub fallback
      "groq/llama-3.3-70b": "llama-3.3-70b-versatile",
  };
  return map[model] ?? "gpt-4o";
}

export async function POST(req: Request) {
  const {
    messages,
    model = "openai/gpt-4o",
  }: { messages: UIMessage[]; model?: string } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY ?? process.env.GROQ_API_KEY ?? "";

  // Stub mode: return a fixed streamed string when using placeholder key
  if (apiKey === "sk-stub" || apiKey === "" || apiKey.startsWith("gsk_") === false && !apiKey.startsWith("sk-")) {
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const words = STUB_RESPONSE.split(" ");
        for (const word of words) {
          writer.write({
            type: "text-delta",
            id: "stub",
            delta: word + " ",
          });
          await new Promise((r) => setTimeout(r, 35));
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  }

  // Real mode
  const modelId = getModelId(model);
  const modelMessages = await convertToModelMessages(messages);

  const modelInstance = model.includes("groq")
    ? openai("llama-3.3-70b-versatile")
    : openai(modelId);

  const result = streamText({
    model: modelInstance,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
