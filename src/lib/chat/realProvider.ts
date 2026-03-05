import { ChatProvider, ChatMessage } from "./types";

export const realProvider: ChatProvider = {
  id: "real",
  async send(messages: ChatMessage[]) {
    // Calls serverless endpoint (safe: no API keys in browser)
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages })
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Chat request failed: ${res.status} ${txt}`);
    }

    const data = (await res.json()) as { reply: string };
    return data.reply;
  }
};