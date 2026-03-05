import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";
import * as tf from "@tensorflow/tfjs";
import { Example, Label, Shape, makeInput, oneHotToLabel } from "./toyData";
import { buildAndTrain, predict } from "./model";

function clamp255(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) => clamp255(x).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function scoreStars(acc: number) {
  if (acc >= 0.9) return 3;
  if (acc >= 0.75) return 2;
  if (acc >= 0.6) return 1;
  return 0;
}

export default function TrainClassifier() {
  const { setStars } = useProgress();

  const [examples, setExamples] = useState<Example[]>(() => [
    { color: { r: 30, g: 200, b: 80 }, shape: "circle", label: "Robot" },
    { color: { r: 20, g: 180, b: 60 }, shape: "square", label: "Robot" },
    { color: { r: 240, g: 60, b: 180 }, shape: "triangle", label: "Alien" },
    { color: { r: 220, g: 40, b: 160 }, shape: "circle", label: "Alien" },
    { color: { r: 40, g: 210, b: 90 }, shape: "triangle", label: "Robot" },
    { color: { r: 200, g: 50, b: 150 }, shape: "square", label: "Alien" }
  ]);

  const [colorHex, setColorHex] = useState("#2ccf65");
  const [shape, setShape] = useState<Shape>("circle");
  const [label, setLabel] = useState<Label>("Robot");

  const [epochs, setEpochs] = useState(25);
  const [status, setStatus] = useState("Add examples, then train!");
  const [training, setTraining] = useState(false);

  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [epochNow, setEpochNow] = useState(0);
  const [accNow, setAccNow] = useState(0);

  const [testColorHex, setTestColorHex] = useState("#e84aa9");
  const [testShape, setTestShape] = useState<Shape>("square");
  const [prediction, setPrediction] = useState<string>("");

  const addExample = () => {
    const rgb = hexToRgb(colorHex);
    setExamples((ex) => [...ex, { color: rgb, shape, label }]);
  };

  const removeExample = (idx: number) => {
    setExamples((ex) => ex.filter((_, i) => i !== idx));
  };

  const train = async () => {
    setPrediction("");
    setStatus("Warming up the AI brain… 🧠");
    setTraining(true);
    setEpochNow(0);
    setAccNow(0);

    try {
      await tf.ready();
      const res = await buildAndTrain(examples, epochs, (ep, logs) => {
        const acc = (logs.acc ?? logs.accuracy ?? 0) as number;
        setEpochNow(ep);
        setAccNow(acc);
        setStatus(`Training… epoch ${ep}/${epochs} • accuracy ${(acc * 100).toFixed(0)}%`);
      });
      setModel(res.model);
      const finalAcc = res.history.acc.at(-1) ?? 0;
      setStatus(`Done! Final accuracy: ${(finalAcc * 100).toFixed(0)}%`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Training failed.");
      setModel(null);
    } finally {
      setTraining(false);
    }
  };

  const doPredict = async () => {
    if (!model) {
      setPrediction("Train first!");
      return;
    }
    const rgb = hexToRgb(testColorHex);
    const ex: Example = { color: rgb, shape: testShape, label: "Robot" }; // label unused for predict
    const probs = await predict(model, makeInput(ex));
    const guess = oneHotToLabel(probs);
    const robotP = probs[0];
    const alienP = probs[1];
    setPrediction(`Guess: ${guess} (Robot ${(robotP * 100).toFixed(0)}% • Alien ${(alienP * 100).toFixed(0)}%)`);
  };

  const stars = useMemo(() => scoreStars(accNow), [accNow]);

  const save = () => {
    setStars("classifier", stars);
  };

  const tutorMsg = model
    ? "Nice! Training = practice time. Prediction = guessing on new stuff."
    : "Add examples. More variety helps the AI learn a better rule.";

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">🎯 Train the Classifier</h1>
        <p className="kids-sub">
          Teach the AI using examples (training). Then ask it to guess (prediction)!
        </p>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>1) Add Training Examples</div>

          <div className="row">
            <label className="pill">
              🎨 Color
              <input
                className="focusRing"
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                aria-label="Pick color"
              />
            </label>

            <label className="pill">
              🔺 Shape
              <select
                className="focusRing"
                value={shape}
                onChange={(e) => setShape(e.target.value as Shape)}
                aria-label="Pick shape"
              >
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
              </select>
            </label>

            <label className="pill">
              🏷️ Label
              <select
                className="focusRing"
                value={label}
                onChange={(e) => setLabel(e.target.value as Label)}
                aria-label="Pick label"
              >
                <option value="Robot">Robot</option>
                <option value="Alien">Alien</option>
              </select>
            </label>

            <button className="btn primary focusRing" onClick={addExample}>
              Add Example
            </button>
          </div>

          <div style={{ marginTop: 10, color: "rgba(242,246,255,0.75)" }}>
            Examples: <b>{examples.length}</b> (need 6+)
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8, maxHeight: 180, overflow: "auto" }}>
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="card card-pad"
                style={{ background: "rgba(0,0,0,0.12)", borderColor: "rgba(124,243,255,0.12)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        display: "inline-block",
                        background: rgbToHex(ex.color.r, ex.color.g, ex.color.b),
                        border: "1px solid rgba(255,255,255,0.18)"
                      }}
                    />
                    <div>
                      <b>{ex.label}</b> • {ex.shape}
                      <div style={{ color: "rgba(242,246,255,0.7)", fontSize: 13 }}>
                        rgb({ex.color.r},{ex.color.g},{ex.color.b})
                      </div>
                    </div>
                  </div>
                  <button className="btn danger focusRing" onClick={() => removeExample(idx)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>2) Train</div>
          <div className="row">
            <label className="pill">
              ⏱️ Epochs
              <input
                className="focusRing"
                type="number"
                min={5}
                max={80}
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                style={{ width: 90 }}
              />
            </label>
            <button className="btn primary focusRing" onClick={train} disabled={training}>
              {training ? "Training…" : "Train AI"}
            </button>
            <span className="pill">📈 Accuracy: {(accNow * 100).toFixed(0)}%</span>
            <span className="pill">⭐ Stars now: {"⭐".repeat(stars)}{" "}
              <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - stars)}</span>
            </span>
          </div>
          <div style={{ marginTop: 10, color: "rgba(242,246,255,0.8)" }}>{status}</div>

          <div style={{ marginTop: 12 }}>
            <button className="btn focusRing" onClick={save} disabled={!model}>
              Save Stars
            </button>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 12, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>3) Predict</div>
          <div className="row">
            <label className="pill">
              🎨 Color
              <input
                className="focusRing"
                type="color"
                value={testColorHex}
                onChange={(e) => setTestColorHex(e.target.value)}
              />
            </label>

            <label className="pill">
              🔺 Shape
              <select
                className="focusRing"
                value={testShape}
                onChange={(e) => setTestShape(e.target.value as Shape)}
              >
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
              </select>
            </label>

            <button className="btn focusRing" onClick={doPredict}>
              Predict
            </button>
          </div>

          {prediction && (
            <div style={{ marginTop: 10 }} className="pill">
              🧠 {prediction}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Link className="btn focusRing" to="/">
            Back to Academy
          </Link>
          <Link className="btn focusRing" to="/minigame/label">
            Next: Sort & Label →
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <RobotTutor
          title="Robot Tutor"
          message={tutorMsg}
          hint="Try adding more examples of both labels. Balance helps accuracy!"
        />

        <div className="card card-pad">
          <h2 style={{ margin: 0 }}>Kid-friendly idea</h2>
          <p className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
            A classifier is like a sorting robot. You show it examples (training), then it guesses
            the label for a new thing (prediction).
          </p>
          <div className="pill">⚡ Tip: If accuracy is low, add more variety!</div>
        </div>
      </div>
    </div>
  );
}