import type { ApiResult } from "@/lib/types";

export function ErrorPanel({ results }: { results: ApiResult<unknown>[] }) {
  const failures = results.filter((result) => !result.ok);
  if (!failures.length) return null;

  return (
    <div className="errorStack">
      {failures.map((failure) => (
        <div className="error" key={failure.player}>
          {failure.player}: {failure.error ?? "Deze speler kon niet geladen worden."}
        </div>
      ))}
    </div>
  );
}
