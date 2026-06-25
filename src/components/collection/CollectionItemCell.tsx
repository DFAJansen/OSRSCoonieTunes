import type { CollectionItemOwnership } from "@/lib/collection";

export function CollectionItemCell({ item, player }: { item: CollectionItemOwnership; player: string }) {
  const state = item.ownedBy.includes(player) ? "owned" : item.missingBy.includes(player) ? "missing" : "unknown";
  const label = state === "owned" ? "Owned" : state === "missing" ? "Missing" : "Unknown";
  const symbol = state === "owned" ? "✓" : state === "missing" ? "×" : "?";

  return (
    <td className={`collectionItemCell ${state}`} title={`${player}: ${label}`}>
      <span aria-label={`${player}: ${label}`}>{symbol}</span>
    </td>
  );
}
