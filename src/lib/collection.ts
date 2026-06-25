import type { ApiResult, NormalizedCollection, PetSummary, RecentItem } from "./types";

export type PlayerCollectionStatus = {
  username: string;
  status: "synced" | "not-synced" | "error";
  message: string;
  summary?: NormalizedCollection;
};

export type CollectionStatus = PlayerCollectionStatus;

export type CollectionBounty = {
  player: string;
  title: string;
  detail: string;
  points: number;
};

export function getCollectionStatus(result: ApiResult<NormalizedCollection>): PlayerCollectionStatus {
  if (result.ok && result.data) {
    return {
      username: result.player ?? result.data.username,
      status: "synced",
      message: "Synced",
      summary: result.data
    };
  }
  const message = result.error ?? "Collection log unavailable";
  return {
    username: result.player ?? "Player unavailable",
    status: /not synced|has not synced|402/i.test(message) ? "not-synced" : "error",
    message
  };
}

export function calculateCollectionScore(collection?: NormalizedCollection, pets?: PetSummary, recentItems: RecentItem[] = []): number {
  const notables = recentItems.filter((item) => item.notable).length;
  return (
    (collection?.finishedItems ?? 0) * 10 +
    (collection?.percentage ?? 0) * 25 +
    (collection?.finishedCategories ?? 0) * 100 +
    notables * 50 +
    (pets?.petCount ?? 0) * 300
  );
}

export function findSharedItems(collections: NormalizedCollection[]): string[] {
  if (!collections.length) return [];
  return collections[0].itemNames.filter((item) => collections.every((collection) => collection.itemNames.includes(item)));
}

export function findUniqueItemsByPlayer(collections: NormalizedCollection[]): Record<string, string[]> {
  return Object.fromEntries(
    collections.map((collection) => [
      collection.username,
      collection.itemNames.filter((item) => collections.every((other) => other.username === collection.username || !other.itemNames.includes(item)))
    ])
  );
}

export function findEveryoneMissingItems(collections: NormalizedCollection[]): string[] {
  const missing = new Set(collections.flatMap((collection) => collection.missingItemNames));
  return [...missing].filter((item) => collections.every((collection) => collection.missingItemNames.includes(item))).slice(0, 30);
}

export function findCollectionBounties(collections: NormalizedCollection[]): CollectionBounty[] {
  return collections.map((collection) => {
    const nextTarget = collection.finishedItems && collection.finishedItems < 500 ? 500 : 1000;
    const missing = collection.finishedItems === null ? 0 : Math.max(0, nextTarget - collection.finishedItems);
    return {
      player: collection.username,
      title: `${collection.username} can push the museum score`,
      detail: missing ? `${missing} items until the next collection title threshold.` : "Next title threshold reached. Hunt notables now.",
      points: missing ? Math.min(250, missing * 10) : 250
    };
  });
}
