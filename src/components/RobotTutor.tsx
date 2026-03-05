import { motion } from "framer-motion";

export default function RobotTutor({
  title,
  message,
  hint
}: {
  title: string;
  message: string;
  hint?: string;
}) {
  return (
    <motion.div
      className="card card-pad"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="status"
      aria-live="polite"
      style={{
        background: "linear-gradient(180deg, rgba(16,27,51,0.95), rgba(15,36,71,0.85))"
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          aria-hidden="true"
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: "rgba(124,243,255,0.14)",
            border: "1px solid rgba(124,243,255,0.25)"
          }}
        >
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
          <div className="bigText" style={{ color: "rgba(242,246,255,0.92)" }}>
            {message}
          </div>
          {hint && (
            <div style={{ marginTop: 10, color: "rgba(242,246,255,0.76)" }}>
              <b>Hint:</b> {hint}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}