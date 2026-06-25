import {
  categoryKeyMatchesCategory,
  findItemByNameOrAlias,
  getItemsBySubCategory,
  getSubCategoriesByTopTab,
  getSubCategoryById,
  itemMatchesCategory,
  normalizeSearch,
  type CollectionItemDefinition,
  type CollectionSubCategory
} from "./collection-log-structure";
import { normalizeCollectionLog } from "./normalizers-fixed";
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

export type PartyCollectionPlayer = {
  username: string;
  status: PlayerCollectionStatus["status"];
  message: string;
  collection?: NormalizedCollection;
};

export type ItemOwnershipStatus = "everyone" | "nobody" | "unique" | "contested" | "unknown";

export type CollectionItemOwnership = {
  id: string;
  name: string;
  categoryId: string;
  itemId?: number;
  notable?: boolean;
  ownedBy: string[];
  missingBy: string[];
  unknownFor: string[];
  ownedCount: number;
  syncedCount: number;
  status: ItemOwnershipStatus;
  mappingSource: "definition" | "templeosrs";
};

export type CategoryPlayerSummary = {
  player: string;
  status: PartyCollectionPlayer["status"];
  owned: number;
  total: number;
  missing: number;
  unique: number;
};

export type CategoryComparison = {
  category: CollectionSubCategory;
  items: CollectionItemOwnership[];
  playerSummaries: CategoryPlayerSummary[];
  leader: CategoryPlayerSummary | null;
  closestRival: CategoryPlayerSummary | null;
  partyFoundCount: number;
  totalItemCount: number;
  everyoneMissingCount: number;
  uniqueFlexCount: number;
  partial: boolean;
  hasDefinitions: boolean;
  hasSyncedData: boolean;
  matchedTempleItemCount: number;
  unmatchedTempleItems: string[];
  debug: CollectionDebugInfo;
};

export type CollectionDebugInfo = {
  topTab: string;
  category: string;
  expectedItemCount: number;
  matchedTempleOwnedItemCount: number;
  unmatchedTempleItemCount: number;
  syncedPlayers: string[];
  unsyncedPlayers: string[];
  categoryAliases: string[];
  unmatchedTempleItems: string[];
};

export type PartyCollectionModel = {
  players: PartyCollectionPlayer[];
  syncedPlayers: PartyCollectionPlayer[];
  lockedPlayers: PartyCollectionPlayer[];
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

export function normalizePlayerCollectionLog(raw: unknown, player: string): NormalizedCollection {
  return normalizeCollectionLog(raw, player);
}

export function getPlayerCollectionStatus(playerCollection: ApiResult<NormalizedCollection> | NormalizedCollection): PlayerCollectionStatus {
  if ("ok" in playerCollection) return getCollectionStatus(playerCollection);
  return {
    username: playerCollection.username,
    status: "synced",
    message: "Synced",
    summary: playerCollection
  };
}

export function getOwnedItemNames(playerCollection?: NormalizedCollection): string[] {
  return playerCollection?.itemNames ?? [];
}

export function buildPartyCollectionModel(playersCollections: PlayerCollectionStatus[]): PartyCollectionModel {
  const players = playersCollections.map<PartyCollectionPlayer>((status) => ({
    username: status.username,
    status: status.status,
    message: status.message,
    collection: status.summary
  }));

  return {
    players,
    syncedPlayers: players.filter((player) => player.status === "synced" && player.collection),
    lockedPlayers: players.filter((player) => player.status !== "synced" || !player.collection)
  };
}

function sameItem(left: string, right: string): boolean {
  return normalizeSearch(left) === normalizeSearch(right);
}

function hasItem(items: string[], itemName: string): boolean {
  return items.some((item) => sameItem(item, itemName));
}

function itemDefinitionFromName(name: string, categoryId: string, itemId?: number): CollectionItemDefinition {
  const known = findItemByNameOrAlias(name);
  return known ?? { id: normalizeSearch(`${categoryId} ${name}`).replace(/\s+/g, "-"), name, categoryId, itemId };
}

function recordMatchesCategory(record: { name: string; categoryKey?: string }, category: CollectionSubCategory): boolean {
  if (category.id === "clues-all-clues") {
    return getSubCategoriesByTopTab("Clues")
      .filter((candidate) => candidate.id !== category.id)
      .some((candidate) => recordMatchesCategory(record, candidate));
  }

  return categoryKeyMatchesCategory(record.categoryKey, category) || itemMatchesCategory(record.name, category);
}

function getCategoryItemDefinitions(category: CollectionSubCategory, model: PartyCollectionModel): CollectionItemDefinition[] {
  const byName = new Map<string, CollectionItemDefinition>();

  getItemsBySubCategory(category.id).forEach((item) => byName.set(normalizeSearch(item.name), item));

  model.syncedPlayers.forEach((player) => {
    const collection = player.collection;
    if (!collection) return;
    collection.collectionItems
      .filter((record) => recordMatchesCategory(record, category))
      .forEach((record) => {
        const key = normalizeSearch(record.name);
        if (!byName.has(key)) byName.set(key, itemDefinitionFromName(record.name, category.id, record.itemId));
      });
  });

  return [...byName.values()];
}

export function getItemOwnership(item: CollectionItemDefinition, partyModel: PartyCollectionModel): CollectionItemOwnership {
  const ownedBy: string[] = [];
  const missingBy: string[] = [];
  const unknownFor: string[] = [];

  partyModel.players.forEach((player) => {
    if (player.status !== "synced" || !player.collection) {
      unknownFor.push(player.username);
      return;
    }

    if (hasItem(player.collection.itemNames, item.name)) {
      ownedBy.push(player.username);
      return;
    }

    if (hasItem(player.collection.missingItemNames, item.name) || player.collection.missingItemNames.length > 0) {
      missingBy.push(player.username);
      return;
    }

    unknownFor.push(player.username);
  });

  const syncedCount = partyModel.syncedPlayers.length;
  const ownedCount = ownedBy.length;
  const status: ItemOwnershipStatus =
    syncedCount === 0 || unknownFor.length === partyModel.players.length
      ? "unknown"
      : ownedCount === 0
        ? "nobody"
        : ownedCount === syncedCount
          ? "everyone"
          : ownedCount === 1
            ? "unique"
            : "contested";

  return {
    id: item.id,
    name: item.name,
    categoryId: item.categoryId,
    itemId: item.itemId,
    notable: item.notable,
    ownedBy,
    missingBy,
    unknownFor,
    ownedCount,
    syncedCount,
    status,
    mappingSource: getItemsBySubCategory(item.categoryId).some((definition) => normalizeSearch(definition.name) === normalizeSearch(item.name)) ? "definition" : "templeosrs"
  };
}

function getUnmatchedTempleItems(partyModel: PartyCollectionModel): string[] {
  const unmatched = new Set<string>();
  partyModel.syncedPlayers.forEach((player) => {
    player.collection?.collectionItems.forEach((record) => {
      const knownCategory = getSubCategoriesByTopTab("Bosses")
        .concat(getSubCategoriesByTopTab("Raids"), getSubCategoriesByTopTab("Clues"), getSubCategoriesByTopTab("Minigames"), getSubCategoriesByTopTab("Other"))
        .some((category) => recordMatchesCategory(record, category));
      if (!knownCategory) unmatched.add(record.categoryKey ? `${record.categoryKey}: ${record.name}` : record.name);
    });
  });
  return [...unmatched].slice(0, 20);
}

export function getCategoryComparison(categoryId: string, partyModel: PartyCollectionModel): CategoryComparison {
  const category = getSubCategoryById(categoryId);
  const definitions = getCategoryItemDefinitions(category, partyModel);
  const items = definitions.map((item) => getItemOwnership(item, partyModel));
  const matchedTempleItemCount = partyModel.syncedPlayers.reduce(
    (count, player) => count + (player.collection?.collectionItems.filter((record) => record.count !== 0 && recordMatchesCategory(record, category)).length ?? 0),
    0
  );
  const unmatchedTempleItems = getUnmatchedTempleItems(partyModel);
  const playerSummaries = partyModel.players.map<CategoryPlayerSummary>((player) => {
    const owned = items.filter((item) => item.ownedBy.includes(player.username)).length;
    const missing = player.status === "synced" ? items.filter((item) => item.missingBy.includes(player.username)).length : 0;
    const unique = items.filter((item) => item.ownedBy.length === 1 && item.ownedBy[0] === player.username).length;

    return {
      player: player.username,
      status: player.status,
      owned,
      total: items.length,
      missing,
      unique
    };
  });

  const syncedSummaries = playerSummaries
    .filter((summary) => summary.status === "synced")
    .sort((a, b) => b.owned - a.owned || a.missing - b.missing || a.player.localeCompare(b.player));

  return {
    category,
    items,
    playerSummaries,
    leader: syncedSummaries[0] ?? null,
    closestRival: syncedSummaries[1] ?? null,
    partyFoundCount: items.filter((item) => item.ownedCount > 0).length,
    totalItemCount: items.length,
    everyoneMissingCount: items.filter((item) => item.status === "nobody").length,
    uniqueFlexCount: items.filter((item) => item.status === "unique").length,
    partial: partyModel.lockedPlayers.length > 0 || items.length === 0,
    hasDefinitions: getItemsBySubCategory(category.id).length > 0,
    hasSyncedData: partyModel.syncedPlayers.length > 0,
    matchedTempleItemCount,
    unmatchedTempleItems,
    debug: {
      topTab: category.topTab,
      category: category.label,
      expectedItemCount: definitions.length,
      matchedTempleOwnedItemCount: matchedTempleItemCount,
      unmatchedTempleItemCount: unmatchedTempleItems.length,
      syncedPlayers: partyModel.syncedPlayers.map((player) => player.username),
      unsyncedPlayers: partyModel.lockedPlayers.map((player) => player.username),
      categoryAliases: category.aliases ?? [category.label],
      unmatchedTempleItems
    }
  };
}

export function getMissingForPlayer(player: string, categoryId: string, partyModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison(categoryId, partyModel).items.filter((item) => item.missingBy.includes(player));
}

export function getOwnedByNobody(categoryId: string, partyModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison(categoryId, partyModel).items.filter((item) => item.status === "nobody");
}

export function getOwnedByEveryone(categoryId: string, partyModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison(categoryId, partyModel).items.filter((item) => item.status === "everyone");
}

export function getUniqueToOnePlayer(categoryId: string, partyModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison(categoryId, partyModel).items.filter((item) => item.status === "unique");
}

export function getContestedItems(categoryId: string, partyModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison(categoryId, partyModel).items.filter((item) => item.status === "contested" || item.status === "unique");
}

export function calculateCategoryLeader(categoryId: string, partyModel: PartyCollectionModel): CategoryPlayerSummary | null {
  return getCategoryComparison(categoryId, partyModel).leader;
}

export function calculatePartyCompletion(categoryId: string, partyModel: PartyCollectionModel): { found: number; total: number } {
  const comparison = getCategoryComparison(categoryId, partyModel);
  return { found: comparison.partyFoundCount, total: comparison.totalItemCount };
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
