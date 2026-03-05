import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";

type Token = "🔵" | "🟡" | "🟣" | "🟩" | "🔺" | "⭐";

type Puzzle = {
  id: number;
  sequence: Token[];
  options: Token[];
  answer: Token;
  ruleKid: string;
};

function scoreToStars(correct: number, total: number) {
  const ratio = correct / total;
  if (ratio >= 1) return 3;
  if (ratio >= 0.67) return 2;
  if (ratio >= 0.34) return 1;
  return 0;
}

export default function PatternDetective() {
  const { setStars } = useProgress();

  const puzzles = useMemo<Puzzle[]>(
    () => [
      {
        id: 1,
        sequence: ["🔵", "🟡", "🔵", "🟡", "🔵", "❓" as unknown as Token],
        options: ["🟡", "🟣", "⭐", "🔺"],
        answer: "🟡",
        ruleKid: "It alternates: blue, yellow, blue, yellow…"
      },
      {
        id: 2,
        sequence: ["🔺", "🔺", "⭐", "🔺", "🔺", "❓" as unknown as Token],
        options: ["⭐", "🔵", "🔺", "🟩"],
        answer: "⭐",
        ruleKid: "Two triangles, then a star, repeat."
      },
      {
        id: 3,
        sequence: ["🟩", "🟣", "🟩", "🟣", "🟣", "❓" as unknown as Token],
        options: ["🟩", "🟣", "⭐", "🟡"],
        answer: "🟩",
        ruleKid: "Green, purple, green, purple… but the purple doubled once—AI looks for the best rule!"
      }
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<Token | null>(null);
  const [feedback, setFeedback] = useState<string>("Pick what comes next!");

  const current = puzzles[step];
  const done = step >= puzzles.length;

  const onPick = (t: Token) => {
    if (picked) return;
    setPicked(t);
    const ok = t === current.answer;
    setFeedback(ok ? "✅ Nice! You found the pattern." : "❌ Not this time—try spotting the rule.");
    if (ok) setCorrect((c) => c + 1);

    setTimeout(() => {
      setPicked(null);
      setFeedback("Pick what comes next!");
      setStep((s) => s + 1);
    }, 900);
  };

  const stars = scoreToStars(correct, puzzles.length);

  const finish = () => {
    setStars("pattern", stars);
  };

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">🧩 Pattern Detective</h1>
        <p className="kids-sub">
          AI is great at finding patterns. Your job: guess the next symbol!
        </p>

        {!done ? (
          <>
            <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>
                Puzzle {step + 1} / {puzzles.length}
              </div>

              <div style={{ fontSize: 34, letterSpacing: 6 }}>
                {current.sequence.map((x, i) => (
                  <span key={i} style={{ paddingRight: 6 }}>
                    {x === ("❓" as unknown as Token) ? "❓" : x}
                  </span>
                ))}
              </div>

              <div className="row" style={{ marginTop: 14 }}>
                {current.options.map((o) => (
                  <button
                    key={o}
                    className="btn focusRing"
                    onClick={() => onPick(o)}
                    disabled={!!picked}
                    aria-label={`Choose ${o}`}
                    style={{ fontSize: 22 }}
                  >
                    {o}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 10, color: "rgba(242,246,255,0.80)" }}>
                <b>Score:</b> {correct} / {puzzles.length}
              </div>
            </div>

            <RobotTutor title="Robot Tutor" message={feedback} hint="Look for repeats, alternates, or groups!" />
          </>
        ) : (
          <>
            <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>Level Complete!</div>
              <p className="bigText" style={{ marginTop: 8 }}>
                You solved <b>{correct}</b> out of <b>{puzzles.length}</b>.
              </p>
              <p className="bigText">
                Stars earned: <b>{"⭐".repeat(stars)}</b>
                <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - stars)}</span>
              </p>
              <button className="btn primary focusRing" onClick={finish}>
                Save Stars
              </button>

              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <Link className="btn focusRing" to="/">
                  Back to Academy
                </Link>
                <Link className="btn focusRing" to="/minigame/classifier">
                  Next: Train the Classifier →
                </Link>
              </div>
            </div>

            <RobotTutor
              title="What AI learned"
              message="When AI sees many examples, it can discover a rule (pattern). Then it can predict what comes next!"
            />
          </>
        )}
      </div>

      <div className="card card-pad">
        <h2 style={{ margin: 0 }}>How this teaches AI</h2>
        <p className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
          Pattern recognition is a big AI skill. In real life, AI finds patterns in pictures, sounds,
          and text—then uses them to make guesses (predictions).
        </p>

        {!done && (
          <div className="card card-pad" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontWeight: 900 }}>Rule for this puzzle (after you try):</div>
            <div style={{ marginTop: 8, color: "rgba(242,246,255,0.82)" }}>{current.ruleKid}</div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Link className="btn focusRing" to="/dashboard">
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
}