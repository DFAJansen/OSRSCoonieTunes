import type { CollectionItemOwnership } from "@/lib/collection";

export function PetCell({ pet, player }: { pet: CollectionItemOwnership; player: string }) {
  const state = pet.ownedBy.includes(player) ? "owned" : pet.missingBy.includes(player) ? "missing" : "unknown";
  const label = state === "owned" ? "Owned" : state === "missing" ? "Missing" : "Unknown";
  const symbol = state === "owned" ? "\u2713" : state === "missing" ? "\u00d7" : "?";

  return (
    <td className={`collectionItemCell ${state}`} title={`${player}: ${label}`}>
      <span aria-label={`${player}: ${label}`}>{symbol}</span>
    </td>
  );
}
