import type { CategoryComparison } from "@/lib/collection";

export function CollectionCategorySummary({ comparison }: { comparison: CategoryComparison }) {
  return (
    <section className="collectionCategorySummary" aria-label={`${comparison.category.label} summary`}>
      <div>
        <span>Selected log</span>
        <h1>{comparison.category.label}</h1>
      </div>
      <dl>
        <div>
          <dt>Party completion</dt>
          <dd>
            {comparison.partyFoundCount} / {comparison.totalItemCount}
          </dd>
        </div>
        <div>
          <dt>Leader</dt>
          <dd>{comparison.leader ? `${comparison.leader.player}, ${comparison.leader.owned} / ${comparison.leader.total}` : "Locked"}</dd>
        </div>
        <div>
          <dt>Closest rival</dt>
          <dd>{comparison.closestRival ? `${comparison.closestRival.player}, ${comparison.closestRival.owned} / ${comparison.closestRival.total}` : "None yet"}</dd>
        </div>
        <div>
          <dt>Everyone missing</dt>
          <dd>{comparison.everyoneMissingCount} items</dd>
        </div>
        <div>
          <dt>Unique flexes</dt>
          <dd>{comparison.uniqueFlexCount} items</dd>
        </div>
      </dl>
      {comparison.partial ? <p>Partial comparison: locked players or unavailable item data are shown as unknown.</p> : null}
    </section>
  );
}
