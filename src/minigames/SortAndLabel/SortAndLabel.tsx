import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";
import { ITEMS, LabelItem, ItemClass } from "./items";

type Pick = {
  id: string;
  chosen: ItemClass;
  correct: boolean;
};

function starsFrom(labelQuality: number) {
  if (labelQuality >= 0.9) return 3;
  if (labelQuality >= 0.75) return 2;
  if (labelQuality >= 0.6) return 1;
  return 0;
}

export default function SortAndLabel() {
  const { setStars } = useProgress();

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [messyMode, setMessyMode] = useState(false);

  const item = ITEMS[idx];
  const done = idx >= ITEMS.length;

  const classCounts = useMemo(() => {
    const counts: Record<ItemClass, number> = { MoonKit: 0, SunPup: 0 };
    for (const it of ITEMS) counts[it.trueClass]++;
    return counts;
  }, []);

  const choose = (chosen: ItemClass) => {
    if (!item) return;
    const correct = chosen === item.trueClass;
    setPicks((p) => [...p, { id: item.id, chosen, correct }]);
    setIdx((i) => i + 1);
  };

  const cleanAccuracy = useMemo(() => {
    if (!done) return 0;
    const correct = picks.filter((p) => p.correct).length;
    return picks.length ? correct / picks.length : 0;
  }, [done, picks]);

  // simulate how messy labels reduce model accuracy
  const modelAccuracy = useMemo(() => {
    if (!done) return 0;
    const noisePenalty = messyMode ? 0.22 : 0;
    // also show imbalance effect: "model" tends to guess majority class
    const imbalancePenalty = classCounts.SunPup > classCounts.MoonKit ? 0.08 : 0;
    return Math.max(0, Math.min(1, cleanAccuracy - noisePenalty - imbalancePenalty));
  }, [done, cleanAccuracy, messyMode, classCounts]);

  const stars = starsFrom(modelAccuracy);

  const save = () => setStars("label", stars);

  const tutor = !done
    ? "Label carefully! AI learns from your labels."
    : "See how labeling quality (and balance) can change accuracy.";

  const biasMsg =
    classCounts.SunPup > classCounts.MoonKit
      ? `Notice: there are more SunPups (${classCounts.SunPup}) than MoonKits (${classCounts.MoonKit}). An AI might guess “SunPup” too often.`
      : "This dataset is balanced.";

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">🏷️ Sort & Label</h1>
        <p className="kids-sub">
          Data labeling teaches AI. Messy labels and imbalance can make AI worse (and unfair).
        </p>

        {!done ? (
          <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontWeight: 900 }}>
              Item {idx + 1} / {ITEMS.length} • ID {item.id}
            </div>

            <div style={{ marginTop: 10, fontSize: 28 }}>🐾</div>
            <div className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
              Hint: {item.hint}
            </div>

            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn primary focusRing" onClick={() => choose("MoonKit")}>
                🌙 MoonKit
              </button>
              <button className="btn primary focusRing" onClick={() => choose("SunPup")}>
                ☀️ SunPup
              </button>
            </div>

            <div style={{ marginTop: 12, color: "rgba(242,246,255,0.75)" }}>
              Tip: pretend you are teaching a robot—be consistent!
            </div>
          </div>
        ) : (
          <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>All Labeled!</div>

            <div className="row" style={{ marginTop: 10 }}>
              <span className="pill">✅ Your label accuracy: {(cleanAccuracy * 100).toFixed(0)}%</span>
              <span className="pill">🤖 “Model” accuracy: {(modelAccuracy * 100).toFixed(0)}%</span>
              <span className="pill">
                ⭐ Stars: {"⭐".repeat(stars)}
                <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - stars)}</span>
              </span>
            </div>

            <div className="card card-pad" style={{ marginTop: 12, background: "rgba(0,0,0,0.12)" }}>
              <div style={{ fontWeight: 900 }}>Bias (gentle example)</div>
              <div style={{ marginTop: 8, color: "rgba(242,246,255,0.82)" }}>{biasMsg}</div>
              <div style={{ marginTop: 10, color: "rgba(242,246,255,0.78)" }}>
                Fix: collect more examples of the smaller group (MoonKit), and keep labels clean.
              </div>
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <label className="pill">
                🧼 Messy label simulation
                <input
                  className="focusRing"
                  type="checkbox"
                  checked={messyMode}
                  onChange={(e) => setMessyMode(e.target.checked)}
                  aria-label="Toggle messy label simulation"
                />
              </label>
              <button className="btn focusRing" onClick={save}>
                Save Stars
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <Link className="btn focusRing" to="/">
                Back to Academy
              </Link>
              <Link className="btn focusRing" to="/minigame/tree">
                Next: Decision Tree Quest →
              </Link>
            </div>
          </div>
        )}

        <RobotTutor
          title="Robot Tutor"
          message={tutor}
          hint="Fair AI starts with fair data: balanced + clean labels."
        />
      </div>

      <div className="card card-pad">
        <h2 style={{ margin: 0 }}>What you’re learning</h2>
        <p className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
          AI learns patterns from labeled examples. If labels are messy, AI learns the wrong rule.
          If one class appears way more than another, AI may “favor” it.
        </p>

        <div className="card card-pad" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900 }}>Dataset counts</div>
          <div style={{ marginTop: 8 }}>
            🌙 MoonKit: <b>{classCounts.MoonKit}</b>
          </div>
          <div>
            ☀️ SunPup: <b>{classCounts.SunPup}</b>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link className="btn focusRing" to="/dashboard">
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
}