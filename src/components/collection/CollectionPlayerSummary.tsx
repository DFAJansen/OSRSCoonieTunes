import type { CategoryComparison } from "@/lib/collection";

export function CollectionPlayerSummary({ comparison }: { comparison: CategoryComparison }) {
  return (
    <section className="collectionPlayerSummary" aria-label="Player collection summaries">
      {comparison.playerSummaries.map((summary) => (
        <article className={summary.status === "synced" ? "" : "locked"} key={summary.player}>
          <strong>{summary.player}</strong>
          {summary.status === "synced" ? (
            <>
              <span>
                {summary.owned} / {summary.total}
              </span>
              <small>Missing {summary.missing}</small>
              <small>Unique {summary.unique}</small>
            </>
          ) : (
            <>
              <span>Locked</span>
              <small>Sync required</small>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
