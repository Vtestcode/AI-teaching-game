import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";
import { getChatProvider } from "@/lib/chat/getProvider";
import { ChatMessage } from "@/lib/chat/types";

function starsFromQuiz(score: number) {
  if (score >= 3) return 3;
  if (score === 2) return 2;
  if (score === 1) return 1;
  return 0;
}

export default function ChatbotBuddy() {
  const { state, setStars } = useProgress();
  const provider = useMemo(() => getChatProvider(), []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m Buddy 🤖💬 Tell me what you learned today (patterns, training, labeling, trees), and I’ll give you a mini-quiz!"
    }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [quizScore, setQuizScore] = useState(0);
  const [asked, setAsked] = useState(0);

  const totalStars = Object.values(state.minigames).reduce((s, m) => s + m.starsBest, 0);

  const systemPrompt: ChatMessage = {
    role: "system",
    content:
      "You are a friendly robot tutor for ages 7–12. Keep answers short, cheerful, and safe. Ask ONE quiz question at a time. Give hints, not spoilers. No sensitive attributes. Use emojis sparingly."
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextUser: ChatMessage = { role: "user", content: trimmed };
    const nextMsgs = [...messages, nextUser];
    setMessages(nextMsgs);
    setInput("");
    setBusy(true);

    try {
      const reply = await provider.send([systemPrompt, ...nextMsgs]);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);

      // Simple “quiz scoring” heuristic:
      // If user message contains “because” or “so” and includes key words, give a point occasionally.
      const goodReasoning = /because|so|since/i.test(trimmed);
      const keyWords = /(pattern|train|training|predict|label|accuracy|bias|tree|question)/i.test(trimmed);

      if (goodReasoning && keyWords) setQuizScore((s) => Math.min(3, s + 1));
      setAsked((a) => Math.min(3, a + 1));
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Uh-oh! I couldn’t reach the chatbot service. Try mock mode, or check your /api/chat setup."
        }
      ]);
    } finally {
      setBusy(false);
    }
  };

  const stars = starsFromQuiz(quizScore);
  const save = () => setStars("chat", stars);

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">💬 Chatbot Buddy</h1>
        <p className="kids-sub">
          A robot tutor that explains + quizzes you. Mode: <b>{provider.id}</b>
        </p>

        <div className="row" style={{ marginTop: 10 }}>
          <span className="pill">⭐ Quiz score: {quizScore} / 3</span>
          <span className="pill">
            ⭐ Stars: {"⭐".repeat(stars)}
            <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - stars)}</span>
          </span>
          <button className="btn focusRing" onClick={save}>
            Save Stars
          </button>
        </div>

        <div
          className="card card-pad"
          style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.03)",
            height: 340,
            overflow: "auto"
          }}
          aria-label="Chat messages"
        >
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 900, opacity: 0.9 }}>
                {m.role === "assistant" ? "🤖 Buddy" : "🧒 You"}
              </div>
              <div style={{ color: "rgba(242,246,255,0.86)" }}>{m.content}</div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          style={{ marginTop: 10, display: "flex", gap: 10 }}
        >
          <input
            className="focusRing"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "I learned training vs prediction because..."'
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid rgba(124,243,255,0.25)",
              background: "rgba(0,0,0,0.18)",
              color: "var(--text)"
            }}
            aria-label="Chat input"
          />
          <button className="btn primary focusRing" type="submit" disabled={busy}>
            {busy ? "…" : "Send"}
          </button>
        </form>

        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn focusRing" onClick={() => void send("quiz me")}>
            Quiz me
          </button>
          <button
            className="btn focusRing"
            onClick={() =>
              void send(
                `My progress: totalStars=${totalStars}. Please give me a short recap of the 4 concepts: patterns, training/prediction, labeling/bias, decision trees.`
              )
            }
          >
            Recap
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Link className="btn focusRing" to="/">
            Back to Academy
          </Link>
          <Link className="btn focusRing" to="/dashboard">
            View Dashboard
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <RobotTutor
          title="How this teaches AI"
          message="Chatbots are conversational AI: they take your message, understand it, and reply with helpful text."
          hint="In real apps, we connect to an AI model using an API (but we keep keys secret on the server)."
        />

        <div className="card card-pad">
          <h2 style={{ margin: 0 }}>Stars rule</h2>
          <p className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
            Earn stars by answering with a reason (like “because…”) and using AI words (pattern,
            train, label, tree). It’s a gentle way to practice explaining.
          </p>
          <div className="pill">✅ Accessibility: keyboard-friendly, large text toggle in top bar.</div>
        </div>
      </div>
    </div>
  );
}