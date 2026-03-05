import { Canvas } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import RobotTutor from "@/components/RobotTutor";
import { useProgress } from "@/lib/progress/ProgressContext";
import AcademyScene from "./AcademyScene";

export default function HomeWorld() {
  const nav = useNavigate();
  const { state } = useProgress();
  const [focus, setFocus] = useState<string | null>(null);

  const tip = useMemo(() => {
    const totalStars = Object.values(state.minigames).reduce((s, m) => s + m.starsBest, 0);
    if (totalStars >= 12) return "You’re an Academy Star! Try the chatbot quiz to show off your brainpower.";
    if (totalStars >= 6) return "You’re leveling up! Try training the classifier and watch accuracy improve.";
    return "Pick a portal. Each lesson is short—like a quick AI snack!";
  }, [state.minigames]);

  return (
    <div className="grid2">
      <div className="card" style={{ height: 520, overflow: "hidden" }}>
        <Canvas
          camera={{ position: [6, 4.2, 9], fov: 45 }}
          dpr={[1, 1.5]}
          style={{ height: 520 }}
        >
          <color attach="background" args={["#081022"]} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[6, 8, 4]} intensity={1.2} />
          <Environment preset="city" />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={6}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.2}
          />

          <AcademyScene
            onHover={(id) => setFocus(id)}
            onLeave={() => setFocus(null)}
            onSelect={(id) => {
              const map: Record<string, string> = {
                pattern: "/minigame/pattern",
                classifier: "/minigame/classifier",
                label: "/minigame/label",
                tree: "/minigame/tree",
                chat: "/minigame/chat",
                dashboard: "/dashboard"
              };
              nav(map[id] ?? "/");
            }}
          />

          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
            <Html position={[0, 2.55, -1]} center>
              <div className="pill" style={{ fontWeight: 900 }}>
                🏫 AI Academy Hub
              </div>
            </Html>
          </Float>
        </Canvas>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div className="card card-pad">
          <h1 className="kids-title">Welcome to AI Academy</h1>
          <p className="kids-sub">
            Walk up to a portal (hover), then click to enter a mini-game.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <PortalHint focus={focus} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button className="btn primary focusRing" onClick={() => nav("/dashboard")}>
              📊 Progress Dashboard
            </button>
            <button className="btn focusRing" onClick={() => nav("/minigame/chat")}>
              💬 Talk to Robot Tutor
            </button>
          </div>
        </div>

        <RobotTutor
          title="Robot Tutor"
          message={tip}
          hint="Tip: Hover over a portal to see what it teaches."
        />
      </div>
    </div>
  );
}

function PortalHint({ focus }: { focus: string | null }) {
  const text =
    focus === "pattern"
      ? "🧩 Pattern Detective: spot the rule and finish the sequence."
      : focus === "classifier"
        ? "🎯 Train the Classifier: teach an AI with examples, then predict!"
        : focus === "label"
          ? "🏷️ Sort & Label: labeling matters—and imbalance can be unfair."
          : focus === "tree"
            ? "🌳 Decision Tree Quest: build questions to classify creatures."
            : focus === "chat"
              ? "💬 Chatbot Buddy: recap what you learned and take a quiz."
              : focus === "dashboard"
                ? "📊 Progress: stars, badges, and your learning streak."
                : "Hover over a glowing portal, then click it.";

  return (
    <div className="card card-pad" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>Portal Info</div>
      <div className="bigText" style={{ color: "rgba(242,246,255,0.85)" }}>
        {text}
      </div>
    </div>
  );
}