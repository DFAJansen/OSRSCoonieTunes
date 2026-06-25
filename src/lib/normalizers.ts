import { isBossMetric, normalizeBossName } from "./bosses";
import type {
  BossStat,
  NormalizedCollection,
  NormalizedStats,
  PetSummary,
  PlayerInfo,
  RecentItem,
  SkillName,
  SkillStat
} from "./types";

export const SKILLS: SkillName[] = [
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction"
];

const SYSTEM_FIELDS = new Set([
  "Date",
  "Player",
  "Username",
  "Ehp",
  "Ehb",
  "Primary_ehp",
  "Primary_ehb",
  "Overall",
  "Overall_rank",
  "Overall_level"
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function unwrapData(value: unknown): Record<string, unknown> {
  const record = asRecord(value);
  return asRecord(record.data ?? record);
}

export function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function normalizePlayerInfo(username: string, raw: unknown): PlayerInfo {
  const data = unwrapData(raw);
  const synced = data.collection_log_synced ?? data.clog_synced ?? data.collectionlog_synced;
  return {
    username,
    formattedName: text(data.formatted_rsn ?? data.formattedRSN ?? data.Player ?? data.username),
    gameMode: text(data.gamemode ?? data.game_mode ?? data.Game_mode),
    lastChecked: text(data.last_checked ?? data.Last_checked),
    lastChanged: text(data.last_changed ?? data.Last_changed),
    collectionLogSynced:
      typeof synced === "string" || typeof synced === "number" || typeof synced === "boolean" ? synced : undefined,
    raw: data
  };
}

export function extractSkills(raw: unknown): SkillStat[] {
  const data = unwrapData(raw);
  return SKILLS.map((name) => ({
    name,
    xp: toNumber(data[name]),
    level: toNumber(data[`${name}_level`]),
    rank: toNumber(data[`${name}_rank`])
  }));
}

export function extractBosses(raw: unknown): BossStat[] {
  const data = unwrapData(raw);

  return Object.entries(data)
    .filter(([key, value]) => {
      return toNumber(value) > 0 && isBossMetric(key);
    })
    .map(([key, value]) => ({ name: normalizeBossName(key), kc: toNumber(value) }))
    .sort((a, b) => b.kc - a.kc);
}

export function calculateTotalXp(skills: SkillStat[]): number {
  return skills.reduce((sum, skill) => sum + (skill.xp ?? 0), 0);
}

export function calculateTotalLevel(skills: SkillStat[]): number {
  return skills.reduce((sum, skill) => sum + (skill.level ?? 0), 0);
}

export function calculateBossTotal(bosses: BossStat[]): number {
  return bosses.reduce((sum, boss) => sum + boss.kc, 0);
}

export function normalizePlayerStats(username: string, raw: unknown): NormalizedStats {
  const data = unwrapData(raw);
  const skills = extractSkills(raw);
  const bosses = extractBosses(raw);

  return {
    username,
    skills,
    bosses,
    totalXp: calculateTotalXp(skills),
    totalLevel: calculateTotalLevel(skills),
    totalBossKc: calculateBossTotal(bosses),
    ehp: toNumber(data.Ehp),
    ehb: toNumber(data.Ehb)
  };
}

export function calculateCollectionPercentage(finished: number, available: number): number {
  return available > 0 ? Math.round((finished / available) * 1000) / 10 : 0;
}

function collectNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return text(record.name ?? record.item_name ?? record.item) ?? (typeof item === "string" ? item : "");
    })
    .filter(Boolean);
}

export function normalizeCollectionLog(username: string, raw: unknown): NormalizedCollection {
  const data = unwrapData(raw);
  const finishedItems = toNumber(data.total_collections_finished ?? data.total_items_finished ?? data.obtained);
  const availableItems = toNumber(data.total_collections_available ?? data.total_items_available ?? data.total);
  const finishedCategories = toNumber(data.total_categories_finished);
  const availableCategories = toNumber(data.total_categories_available);

  return {
    username,
    finishedItems,
    availableItems,
    finishedCategories,
    availableCategories,
    rank: toNumber(data.collections_hiscores_rank ?? data.rank),
    percentage: calculateCollectionPercentage(finishedItems, availableItems),
    itemNames: collectNames(data.items ?? data.collection_log ?? data.collections),
    missingItemNames: collectNames(data.missing_items ?? data.missing),
    collectionItems: []
  };
}

export function normalizeRecentItems(username: string, raw: unknown): RecentItem[] {
  const data = unwrapData(raw);
  const list = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

  return list.map((item) => {
    const record = asRecord(item);
    return {
      player: username,
      itemName: text(record.item_name ?? record.name ?? record.item) ?? "Mysterious loot",
      date: text(record.date ?? record.time ?? record.created_at) ?? "",
      notable: Boolean(record.notable ?? record.onlynotable ?? record.is_notable)
    };
  });
}

export function mergeRecentItems(items: RecentItem[][]): RecentItem[] {
  return items
    .flat()
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export function normalizePetCount(username: string, raw: unknown): PetSummary {
  const data = unwrapData(raw);
  const petsValue = data.pets ?? data.pet_list ?? data.items;
  const pets = Array.isArray(petsValue)
    ? petsValue
        .map((pet) => {
          const record = asRecord(pet);
          return text(record.name ?? record.pet_name ?? record.item_name) ?? (typeof pet === "string" ? pet : "");
        })
        .filter(Boolean)
    : [];

  return {
    username,
    petCount: toNumber(data.pet_count ?? data.count ?? pets.length),
    petHours: toNumber(data.pet_hours ?? data.hours),
    pets
  };
}
