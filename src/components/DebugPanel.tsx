export function DebugPanel({ label, data }: { label: string; data: unknown }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <details className="debugPanel">
      <summary>Show raw API debug: {label}</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
