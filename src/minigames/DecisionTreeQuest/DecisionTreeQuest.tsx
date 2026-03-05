import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";
import { CREATURES, QuestionId, QUESTIONS, Creature } from "./creatures";
import { Node, buildNode, split, accuracy, classify } from "./tree";

function starsFromAcc(acc: number) {
  if (acc >= 1) return 3;
  if (acc >= 0.84) return 2;
  if (acc >= 0.67) return 1;
  return 0;
}

export default function DecisionTreeQuest() {
  const { setStars } = useProgress();

  const [rootQ, setRootQ] = useState<QuestionId>("horns");
  const [yesQ, setYesQ] = useState<QuestionId>("wings");
  const [noQ, setNoQ] = useState<QuestionId>("wings");

  const [mystery] = useState<Creature>(() => CREATURES[Math.floor(Math.random() * CREATURES.length)]);
  const [finalGuess, setFinalGuess] = useState<string>("");

  const tree = useMemo<Node>(() => {
    const { yes: yesSamples, no: noSamples } = split(CREATURES, rootQ);

    const yesSplit = split(yesSamples, yesQ);
    const noSplit = split(noSamples, noQ);

    const yesNode = buildNode(yesSamples, yesQ, buildNode(yesSplit.yes), buildNode(yesSplit.no));
    const noNode = buildNode(noSamples, noQ, buildNode(noSplit.yes), buildNode(noSplit.no));

    return buildNode(CREATURES, rootQ, yesNode, noNode);
  }, [rootQ, yesQ, noQ]);

  const acc = useMemo(() => accuracy(tree, CREATURES), [tree]);
  const stars = useMemo(() => starsFromAcc(acc), [acc]);

  const tutorMsg =
    "A decision tree is a game of questions. Each answer helps the AI narrow down the choice!";

  const guessMystery = () => {
    const g = classify(tree, mystery);
    setFinalGuess(`I guess the mystery creature is: ${g} ${g === mystery.clazz ? "✅" : "❌"}`);
  };

  const save = () => setStars("tree", stars);

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">🌳 Decision Tree Quest</h1>
        <p className="kids-sub">
          Build the best questions to classify creatures. Then test your tree!
        </p>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>1) Choose your questions</div>

          <div className="row">
            <label className="pill">
              Root question
              <select className="focusRing" value={rootQ} onChange={(e) => setRootQ(e.target.value as QuestionId)}>
                {Object.entries(QUESTIONS).map(([id, q]) => (
                  <option key={id} value={id}>
                    {q.text}
                  </option>
                ))}
              </select>
            </label>
            <label className="pill">
              If YES, ask
              <select className="focusRing" value={yesQ} onChange={(e) => setYesQ(e.target.value as QuestionId)}>
                {Object.entries(QUESTIONS).map(([id, q]) => (
                  <option key={id} value={id}>
                    {q.text}
                  </option>
                ))}
              </select>
            </label>
            <label className="pill">
              If NO, ask
              <select className="focusRing" value={noQ} onChange={(e) => setNoQ(e.target.value as QuestionId)}>
                {Object.entries(QUESTIONS).map(([id, q]) => (
                  <option key={id} value={id}>
                    {q.text}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <span className="pill">📈 Accuracy on training creatures: {(acc * 100).toFixed(0)}%</span>
            <span className="pill">
              ⭐ Stars: {"⭐".repeat(stars)}
              <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - stars)}</span>
            </span>
            <button className="btn focusRing" onClick={save}>
              Save Stars
            </button>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>2) Visualize your tree</div>
          <TreeViz rootQ={rootQ} yesQ={yesQ} noQ={noQ} />
        </div>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>3) Test a mystery creature</div>
          <div className="pill">
            Mystery: horns {mystery.hasHorns ? "✅" : "❌"} • wings {mystery.hasWings ? "✅" : "❌"} • color{" "}
            {mystery.color}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary focusRing" onClick={guessMystery}>
              Guess with my tree
            </button>
            {finalGuess && <span className="pill">{finalGuess}</span>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Link className="btn focusRing" to="/">
            Back to Academy
          </Link>
          <Link className="btn focusRing" to="/minigame/chat">
            Next: Chatbot Buddy →
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <RobotTutor title="Robot Tutor" message={tutorMsg} hint="Try different root questions—some split the creatures better." />
        <div className="card card-pad">
          <h2 style={{ margin: 0 }}>What’s happening?</h2>
          <p className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
            Each question splits creatures into two groups (YES/NO). The tree keeps splitting until it can make a good guess.
          </p>
          <div style={{ marginTop: 10, color: "rgba(242,246,255,0.75)" }}>
            Real AI uses decision trees for many “choose a question” problems!
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeViz({ rootQ, yesQ, noQ }: { rootQ: QuestionId; yesQ: QuestionId; noQ: QuestionId }) {
  const t = (q: QuestionId) => QUESTIONS[q].text;
  return (
    <div style={{ lineHeight: 1.6 }}>
      <div className="pill">ROOT: {t(rootQ)}</div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="card card-pad" style={{ background: "rgba(0,0,0,0.12)", borderColor: "rgba(124,243,255,0.12)" }}>
          <b>YES →</b> {t(yesQ)}
          <div style={{ marginTop: 6, color: "rgba(242,246,255,0.75)" }}>Then the tree makes a guess at the leaves.</div>
        </div>
        <div className="card card-pad" style={{ background: "rgba(0,0,0,0.12)", borderColor: "rgba(124,243,255,0.12)" }}>
          <b>NO →</b> {t(noQ)}
          <div style={{ marginTop: 6, color: "rgba(242,246,255,0.75)" }}>Different path, different guess.</div>
        </div>
      </div>
    </div>
  );
}