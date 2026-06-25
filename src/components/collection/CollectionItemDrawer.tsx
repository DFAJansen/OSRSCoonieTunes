import type { CollectionItemOwnership } from "@/lib/collection";
import type { CollectionSubCategory } from "@/lib/collection-log-structure";
import type { RecentItem } from "@/lib/types";

function statusLabel(status: CollectionItemOwnership["status"]): string {
  switch (status) {
    case "everyone":
      return "everyone owns";
    case "nobody":
      return "nobody owns";
    case "unique":
      return "unique";
    case "contested":
      return "contested";
    case "unknown":
    default:
      return "unknown";
  }
}

export function CollectionItemDrawer({
  item,
  category,
  recentItems,
  onClose
}: {
  item: CollectionItemOwnership | null;
  category: CollectionSubCategory;
  recentItems: RecentItem[];
  onClose: () => void;
}) {
  if (!item) return null;

  const recent = recentItems.find((recentItem) => recentItem.itemName.toLowerCase() === item.name.toLowerCase());

  return (
    <div className="collectionDrawerBackdrop" role="presentation" onClick={onClose}>
      <aside aria-label={`${item.name} details`} className="collectionItemDrawer" role="dialog" onClick={(event) => event.stopPropagation()}>
        <button aria-label="Close item details" className="drawerClose" onClick={onClose} type="button">
          ×
        </button>
        <span>{category.topTab} / {category.label}</span>
        <h2>{item.name}</h2>
        <dl>
          <div>
            <dt>Party ownership</dt>
            <dd>
              {item.ownedCount} / {item.syncedCount}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{statusLabel(item.status)}</dd>
          </div>
          {item.itemId ? (
            <div>
              <dt>Item id</dt>
              <dd>{item.itemId}</dd>
            </div>
          ) : null}
          {typeof item.notable === "boolean" ? (
            <div>
              <dt>Notable</dt>
              <dd>{item.notable ? "Yes" : "No"}</dd>
            </div>
          ) : null}
          {recent ? (
            <div>
              <dt>Recent item</dt>
              <dd>{recent.player}{recent.date ? `, ${recent.date}` : ""}</dd>
            </div>
          ) : null}
        </dl>
        <div className="drawerList">
          <strong>Owned by</strong>
          {item.ownedBy.length ? item.ownedBy.map((player) => <b key={player}>{player}</b>) : <em>No synced player owns this.</em>}
        </div>
        <div className="drawerList">
          <strong>Missing by</strong>
          {item.missingBy.length ? item.missingBy.map((player) => <b key={player}>{player}</b>) : <em>No confirmed missing players.</em>}
        </div>
        {item.unknownFor.length ? (
          <div className="drawerList locked">
            <strong>Unknown</strong>
            {item.unknownFor.map((player) => <b key={player}>{player}</b>)}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
