import OpenAI from "openai";

/** Groq free tier — OpenAI-compatible API: https://console.groq.com */
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function readAiApiKey(): string {
  const raw = process.env.GROQ_API_KEY || "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function getAiModel(): string {
  return (process.env.AI_MODEL || DEFAULT_MODEL).trim();
}

let client: OpenAI | null = null;
let cachedKey: string | null = null;

function getClient(): OpenAI {
  const apiKey = readAiApiKey();

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("AI_KEY_MISSING");
  }

  if (!client || cachedKey !== apiKey) {
    client = new OpenAI({
      apiKey,
      baseURL: GROQ_BASE_URL,
    });
    cachedKey = apiKey;
  }

  return client;
}

export async function generateChatText(
  history: { role: string; content: string }[],
  systemPrompt: string,
): Promise<string> {
  const ai = getClient();
  const model = getAiModel();

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: (msg.role === "assistant" || msg.role === "model"
        ? "assistant"
        : "user") as "user" | "assistant",
      content: msg.content,
    })),
  ];

  const response = await ai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 512,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  return text;
}

export async function testAiConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const text = await generateChatText(
      [{ role: "user", content: "Reply with exactly: OK" }],
      "Reply with one word only.",
    );
    return { ok: text.length > 0 };
  } catch (err: unknown) {
    return {
      ok: false,
      error: String((err as Error)?.message ?? err).slice(0, 200),
    };
  }
}

function getErrorDetails(err: unknown): {
  status?: number;
  code?: string;
  message: string;
} {
  const e = err as {
    status?: number;
    code?: string;
    error?: { code?: string; message?: string };
    message?: string;
  };

  return {
    status: e.status,
    code: e.code ?? e.error?.code,
    message: String(e.error?.message ?? e.message ?? err ?? ""),
  };
}

export function aiErrorMessage(err: unknown): string {
  const { status, message } = getErrorDetails(err);

  if (message === "AI_KEY_MISSING") {
    return "The AI assistant isn't configured yet. Please use the contact form and I'll get back to you directly.";
  }

  if (message === "AI_EMPTY_RESPONSE") {
    return "I didn't get a proper response. Please try asking again in a moment.";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "I can't reach the server right now. Check your connection and try again.";
  }

  if (
    status === 401 ||
    status === 403 ||
    /invalid api key|authentication|unauthorized/i.test(message)
  ) {
    return "The AI service isn't set up correctly on the server. Please use the contact form for now.";
  }

  if (status === 429 || /rate.?limit/i.test(message)) {
    return "I'm getting a lot of requests right now. Please wait a minute and try again.";
  }

  if (status === 503 || /overloaded|unavailable/i.test(message)) {
    return "The AI service is busy. Please try again shortly or use the contact form.";
  }

  return "Something went wrong on my end. Please try again or reach out through the contact form.";
}
