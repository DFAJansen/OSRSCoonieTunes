import {
  findCollectionBounties,
  findEveryoneMissingItems,
  findSharedItems,
  findUniqueItemsByPlayer
} from "./collection";
import type { NormalizedCollection } from "./types";

export type MuseumCategory = {
  slug: string;
  label: string;
  short: string;
  mood: string;
  question: string;
  keywords: string[];
};

export type PlayerExhibit = {
  username: string;
  owned: string[];
  missing: string[];
  ownedCount: number;
  totalCount: number;
  completion: number | null;
  rarityScore: number;
  globalCompletion: number | null;
  estimated: boolean;
};

export const MUSEUM_CATEGORIES: MuseumCategory[] = [
  { slug: "barrows", label: "Barrows", short: "BR", mood: "Crypt wing", question: "Who owns the crypt?", keywords: ["barrows", "ahrim", "dharok", "guthan", "karil", "torag", "verac"] },
  { slug: "raids", label: "Raids", short: "RD", mood: "Grand vault", question: "Who brought home raid relics?", keywords: ["raid", "olm", "cox", "xeric", "chambers", "theatre", "tob", "verzik", "tombs", "toa", "masori", "torva", "scythe", "tbow", "tumeken", "shadow"] },
  { slug: "bosses", label: "Bosses", short: "BS", mood: "Trophy hall", question: "Who has the boss trophies?", keywords: ["zulrah", "vorkath", "hydra", "cerberus", "kraken", "graardor", "zilyana", "kree", "k'ril", "corporeal", "nightmare", "muspah", "leviathan", "vardorvis", "duke", "whisperer"] },
  { slug: "clues", label: "Clues", short: "CL", mood: "Treasure archive", question: "Who is blessed by clue RNG?", keywords: ["clue", "trimmed", "gilded", "ranger", "wizard boots", "blessed", "ornament", "3rd age", "third age"] },
  { slug: "pets", label: "Pets", short: "PT", mood: "Menagerie case", question: "Who has the rare companions?", keywords: ["pet", "kitten", "chompy chick", "tangleroot", "rocky", "heron", "beaver", "squirrel", "phoenix", "olmlet", "jad", "zuk"] },
  { slug: "slayer", label: "Slayer", short: "SL", mood: "Hunter wall", question: "Who farms the dark corners?", keywords: ["slayer", "abyssal", "whip", "trident", "hydra", "cerberus", "gargoyle", "grotesque", "basilisk", "jaw", "occult"] },
  { slug: "misc", label: "Misc", short: "MX", mood: "Oddities room", question: "Who collects the weird stuff?", keywords: [] }
];

export function selectedCategory(value: string | string[] | undefined): MuseumCategory {
  const slug = typeof value === "string" ? value : "barrows";
  return MUSEUM_CATEGORIES.find((category) => category.slug === slug) ?? MUSEUM_CATEGORIES[0];
}

export function categoryHref(slug: string): string {
  return `/collection-log?category=${encodeURIComponent(slug)}`;
}

function matchesKeyword(item: string, keywords: string[]): boolean {
  const normalized = item.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function matchesCategory(item: string, category: MuseumCategory): boolean {
  if (category.slug !== "misc") return matchesKeyword(item, category.keywords);
  return !MUSEUM_CATEGORIES.some((candidate) => candidate.slug !== "misc" && matchesKeyword(item, candidate.keywords));
}

function categoryItems(items: string[], category: MuseumCategory): string[] {
  return items.filter((item) => matchesCategory(item, category));
}

function completionPercent(owned: number, total: number): number | null {
  if (!total) return null;
  return Math.round((owned / total) * 1000) / 10;
}

export function buildPlayerExhibits(collections: NormalizedCollection[], category: MuseumCategory): PlayerExhibit[] {
  return collections
    .map((collection) => {
      const owned = categoryItems(collection.itemNames, category);
      const missing = categoryItems(collection.missingItemNames, category);
      const detailedTotal = owned.length + missing.length;
      const estimateDivisor = MUSEUM_CATEGORIES.length;
      const estimatedTotal = collection.availableItems ? Math.max(1, Math.round(collection.availableItems / estimateDivisor)) : 0;
      const estimatedOwned = collection.finishedItems ? Math.round(collection.finishedItems / estimateDivisor) : 0;
      const totalCount = detailedTotal || estimatedTotal;
      const ownedCount = detailedTotal ? owned.length : estimatedOwned;
      const uniquePressure = ownedCount ? Math.round((ownedCount / Math.max(1, totalCount)) * 100) : 0;

      return {
        username: collection.username,
        owned,
        missing,
        ownedCount,
        totalCount,
        completion: completionPercent(ownedCount, totalCount),
        rarityScore: uniquePressure + Math.min(25, owned.length),
        globalCompletion: collection.percentage,
        estimated: detailedTotal === 0 && totalCount > 0
      };
    })
    .sort((a, b) => (b.completion ?? -1) - (a.completion ?? -1) || b.ownedCount - a.ownedCount);
}

export function averageCompletion(exhibits: PlayerExhibit[]): number | null {
  const known = exhibits.map((exhibit) => exhibit.completion).filter((value): value is number => value !== null);
  if (!known.length) return null;
  return Math.round((known.reduce((sum, value) => sum + value, 0) / known.length) * 10) / 10;
}

export function buildCollectionMuseumData(collections: NormalizedCollection[], activeCategory: MuseumCategory) {
  const exhibits = buildPlayerExhibits(collections, activeCategory);
  const missing = categoryItems(findEveryoneMissingItems(collections), activeCategory);
  return {
    exhibits,
    leader: exhibits[0],
    museumCompletion: averageCompletion(exhibits),
    shared: categoryItems(findSharedItems(collections), activeCategory),
    unique: Object.entries(findUniqueItemsByPlayer(collections)).map(([player, items]) => ({
      player,
      items: categoryItems(items, activeCategory)
    })),
    missing,
    bounties: findCollectionBounties(collections).map((bounty) => {
      const exhibit = exhibits.find((item) => item.username === bounty.player);
      const target = exhibit?.missing[0] ?? missing[0] ?? "a missing museum piece";
      return {
        ...bounty,
        title: `${bounty.player}: claim ${activeCategory.label}`,
        detail: `Next exhibit target: ${target}. ${bounty.detail}`
      };
    })
  };
}
