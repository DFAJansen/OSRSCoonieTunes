import type { CollectionItemOwnership } from "./collection";

export type CollectionFilter = "all" | "missing-player" | "everyone" | "nobody" | "unique" | "contested";

export const COLLECTION_FILTERS: { id: CollectionFilter; label: string }[] = [
  { id: "all", label: "All items" },
  { id: "missing-player", label: "Missing for selected player" },
  { id: "everyone", label: "Owned by everyone" },
  { id: "nobody", label: "Owned by nobody" },
  { id: "unique", label: "Unique to one player" },
  { id: "contested", label: "Contested items" }
];

export function filterCollectionItems(items: CollectionItemOwnership[], filter: CollectionFilter, selectedPlayer: string): CollectionItemOwnership[] {
  switch (filter) {
    case "missing-player":
      return items.filter((item) => item.missingBy.includes(selectedPlayer));
    case "everyone":
      return items.filter((item) => item.status === "everyone");
    case "nobody":
      return items.filter((item) => item.status === "nobody");
    case "unique":
      return items.filter((item) => item.status === "unique");
    case "contested":
      return items.filter((item) => item.status === "contested" || item.status === "unique");
    case "all":
    default:
      return items;
  }
}
