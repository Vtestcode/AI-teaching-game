import { Link } from "react-router-dom";
import { useProgress } from "@/lib/progress/ProgressContext";
import Stars from "./Stars";

const labels: Record<string, { name: string; path: string; emoji: string }> = {
  pattern: { name: "Pattern Detective", path: "/minigame/pattern", emoji: "🧩" },
  classifier: { name: "Train the Classifier", path: "/minigame/classifier", emoji: "🎯" },
  label: { name: "Sort & Label", path: "/minigame/label", emoji: "🏷️" },
  tree: { name: "Decision Tree Quest", path: "/minigame/tree", emoji: "🌳" },
  chat: { name: "Chatbot Buddy", path: "/minigame/chat", emoji: "💬" }
};

export default function ProgressDashboard() {
  const { state, resetAll } = useProgress();

  const totalStars = Object.values(state.minigames).reduce((s, m) => s + m.starsBest, 0);
  const badgeCount = Object.values(state.badges).filter(Boolean).length;

  return (
    <div className="grid2">
      <div className="card card-pad">
        <h1 className="kids-title">Your Progress</h1>
        <p className="kids-sub">Stars, badges, and your AI learning journey.</p>

        <div style={{ marginTop: 14 }} className="row">
          <span className="pill">⭐ Total Stars: {totalStars} / 15</span>
          <span className="pill">🏅 Badges: {badgeCount} / 7</span>
          <span className="pill">🔊 {state.soundOn ? "Sound On" : "Sound Off"}</span>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {Object.entries(state.minigames).map(([id, pg]) => (
            <div
              key={id}
              className="card card-pad"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(124,243,255,0.14)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17 }}>
                    {labels[id].emoji} {labels[id].name}
                  </div>
                  <div style={{ color: "rgba(242,246,255,0.75)" }}>
                    Plays: {pg.plays}{" "}
                    {pg.lastPlayedAt ? `• Last: ${new Date(pg.lastPlayedAt).toLocaleString()}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Stars value={pg.starsBest} />
                  <div style={{ marginTop: 8 }}>
                    <Link className="btn focusRing" to={labels[id].path}>
                      Play
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Link className="btn primary focusRing" to="/">
            Back to Academy
          </Link>
          <button className="btn danger focusRing" onClick={resetAll}>
            Reset Progress
          </button>
        </div>
      </div>

      <div className="card card-pad">
        <h2 style={{ margin: 0 }}>Badges</h2>
        <p className="kids-sub">Collect these by earning 3 stars in games and exploring!</p>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <BadgeRow earned={state.badges.FirstSteps} title="First Steps" desc="Play any game." icon="👣" />
          <BadgeRow earned={state.badges.PatternPro} title="Pattern Pro" desc="3⭐ in Pattern Detective." icon="🧩" />
          <BadgeRow earned={state.badges.TinyTrainer} title="Tiny Trainer" desc="3⭐ in Train the Classifier." icon="🎯" />
          <BadgeRow earned={state.badges.FairLabeler} title="Fair Labeler" desc="3⭐ in Sort & Label." icon="🏷️" />
          <BadgeRow earned={state.badges.TreeBuilder} title="Tree Builder" desc="3⭐ in Decision Tree Quest." icon="🌳" />
          <BadgeRow earned={state.badges.ChatChampion} title="Chat Champion" desc="3⭐ in Chatbot Buddy." icon="💬" />
          <BadgeRow earned={state.badges.AcademyStar} title="Academy Star" desc="Earn 12+ total stars." icon="🌟" />
        </div>
      </div>
    </div>
  );
}

function BadgeRow({
  earned,
  title,
  desc,
  icon
}: {
  earned: boolean;
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div
      className="card card-pad"
      style={{
        background: earned ? "rgba(72,255,146,0.10)" : "rgba(255,255,255,0.03)",
        borderColor: earned ? "rgba(72,255,146,0.35)" : "rgba(124,243,255,0.14)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(242,246,255,0.15)"
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: 900 }}>{title}</div>
            <div style={{ color: "rgba(242,246,255,0.75)" }}>{desc}</div>
          </div>
        </div>
        <div style={{ fontWeight: 900 }}>{earned ? "✅" : "⬜"}</div>
      </div>
    </div>
  );
}