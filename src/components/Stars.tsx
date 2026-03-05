export default function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(3, value));
  return (
    <span aria-label={`${v} out of 3 stars`}>
      {"⭐".repeat(v)}
      <span style={{ opacity: 0.35 }}>{"⭐".repeat(3 - v)}</span>
    </span>
  );
}