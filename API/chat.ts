import type { VercelRequest, VercelResponse } from "@vercel/node";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    res.status(500).json({ reply: "Server is missing OPENAI_API_KEY. Use mock mode or set env vars." });
    return;
  }

  const body = req.body as { messages?: ChatMessage[] };
  const messages = body?.messages ?? [];

  // Safety: keep messages short
  const safeMessages = messages.slice(-12).map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, 1200)
  }));

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: safeMessages,
        temperature: 0.6,
        max_tokens: 220
      })
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      res.status(500).json({ reply: `Chat service error: ${r.status} ${t}` });
      return;
    }

    const data = (await r.json()) as any;
    const reply = data?.choices?.[0]?.message?.content?.trim?.() ?? "Hello!";

    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ reply: "Chat server error. Try again later." });
  }
}