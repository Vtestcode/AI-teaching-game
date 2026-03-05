import { Link, useLocation } from "react-router-dom";
import { useProgress } from "@/lib/progress/ProgressContext";

export default function TopBar() {
  const { state, toggleSound, toggleBigText, toggleHighContrast } = useProgress();
  const loc = useLocation();

  return (
    <div
      className="card"
      style={{
        position: "sticky",
        top: 12,
        zIndex: 50,
        margin: "12px auto",
        maxWidth: 1100
      }}
    >
      <div
        className="card-pad"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/" className="focusRing" style={{ fontWeight: 800, fontSize: 18 }}>
            🤖 AI Academy
          </Link>
          <span className="pill">
            <span>Keyboard:</span> <span className="kbd">H</span> <span>Home</span>
          </span>
          {loc.pathname !== "/dashboard" && (
            <Link to="/dashboard" className="btn focusRing">
              Progress
            </Link>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn focusRing" onClick={toggleSound} aria-label="Toggle sound">
            {state.soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>
          <button className="btn focusRing" onClick={toggleBigText} aria-label="Toggle big text">
            {state.bigText ? "🔠 Big Text" : "🔡 Normal Text"}
          </button>
          <button
            className="btn focusRing"
            onClick={toggleHighContrast}
            aria-label="Toggle high contrast"
          >
            {state.colorblindHighContrast ? "🎨 High Contrast" : "🎨 Soft Contrast"}
          </button>
        </div>
      </div>
    </div>
  );
}