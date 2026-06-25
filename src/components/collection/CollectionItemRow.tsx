import type { CollectionItemOwnership } from "@/lib/collection";
import { CollectionItemCell } from "./CollectionItemCell";

function statusLabel(status: CollectionItemOwnership["status"]): string {
  switch (status) {
    case "everyone":
      return "Everyone owns";
    case "nobody":
      return "Nobody owns";
    case "unique":
      return "Unique";
    case "contested":
      return "Contested";
    case "unknown":
    default:
      return "Unknown";
  }
}

export function CollectionItemRow({
  item,
  players,
  onOpen
}: {
  item: CollectionItemOwnership;
  players: string[];
  onOpen: (item: CollectionItemOwnership) => void;
}) {
  return (
    <tr>
      <th scope="row">
        <button type="button" onClick={() => onOpen(item)}>
          {item.name}
        </button>
      </th>
      {players.map((player) => (
        <CollectionItemCell item={item} key={player} player={player} />
      ))}
      <td>
        {item.ownedCount} / {item.syncedCount}
      </td>
      <td>
        <span className={`collectionStatusPill ${item.status}`}>{statusLabel(item.status)}</span>
      </td>
    </tr>
  );
}
