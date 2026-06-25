import type { CollectionItemOwnership } from "@/lib/collection";
import { CollectionItemRow } from "./CollectionItemRow";

export function CollectionItemGrid({
  items,
  players,
  emptyTitle = "No item definitions available yet",
  emptyMessage = "This subcategory is not mapped to Collection War item definitions or TempleOSRS category rows yet.",
  onOpenItem
}: {
  items: CollectionItemOwnership[];
  players: string[];
  emptyTitle?: string;
  emptyMessage?: string;
  onOpenItem: (item: CollectionItemOwnership) => void;
}) {
  if (!items.length) {
    return (
      <section className="collectionEmptyGrid">
        <h2>{emptyTitle}</h2>
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <div className="collectionGridWrap">
      <table className="collectionItemGrid">
        <thead>
          <tr>
            <th scope="col">Item</th>
            {players.map((player) => (
              <th key={player} scope="col">
                {player}
              </th>
            ))}
            <th scope="col">Owned by</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <CollectionItemRow item={item} key={item.id} onOpen={onOpenItem} players={players} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
