export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="scoreBar" aria-label={`${Math.round(value)}%`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
