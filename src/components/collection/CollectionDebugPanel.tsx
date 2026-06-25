import type { CollectionDebugInfo } from "@/lib/collection";

export function CollectionDebugPanel({ debug }: { debug: CollectionDebugInfo }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <details className="collectionDebugPanel">
      <summary>Show collection debug</summary>
      <dl>
        <div>
          <dt>Top tab</dt>
          <dd>{debug.topTab}</dd>
        </div>
        <div>
          <dt>Subcategory</dt>
          <dd>{debug.category}</dd>
        </div>
        <div>
          <dt>Expected items</dt>
          <dd>{debug.expectedItemCount}</dd>
        </div>
        <div>
          <dt>Matched TempleOSRS owned items</dt>
          <dd>{debug.matchedTempleOwnedItemCount}</dd>
        </div>
        <div>
          <dt>Unmatched TempleOSRS items</dt>
          <dd>{debug.unmatchedTempleItemCount}</dd>
        </div>
        <div>
          <dt>Synced players</dt>
          <dd>{debug.syncedPlayers.join(", ") || "None"}</dd>
        </div>
        <div>
          <dt>Unsynced players</dt>
          <dd>{debug.unsyncedPlayers.join(", ") || "None"}</dd>
        </div>
        <div>
          <dt>Category aliases</dt>
          <dd>{debug.categoryAliases.join(", ")}</dd>
        </div>
      </dl>
      {debug.unmatchedTempleItems.length ? (
        <div className="collectionDebugList">
          <strong>First unmatched names</strong>
          {debug.unmatchedTempleItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </details>
  );
}
