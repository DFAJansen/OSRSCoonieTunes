import { getNestedValue, isRecord, safeNumber, safeString } from "./format";
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
  "Attack", "Defence", "Strength", "Hitpoints", "Ranged", "Prayer", "Magic", "Cooking",
  "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining",
  "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction"
];

const SKILL_API_KEYS: Record<SkillName, string> = {
  Attack: "Attack",
  Defence: "Defence",
  Strength: "Strength",
  Hitpoints: "Hitpoints",
  Ranged: "Ranged",
  Prayer: "Prayer",
  Magic: "Magic",
  Cooking: "Cooking",
  Woodcutting: "Woodcutting",
  Fletching: "Fletching",
  Fishing: "Fishing",
  Firemaking: "Firemaking",
  Crafting: "Crafting",
  Smithing: "Smithing",
  Mining: "Mining",
  Herblore: "Herblore",
  Agility: "Agility",
  Thieving: "Thieving",
  Slayer: "Slayer",
  Farming: "Farming",
  Runecrafting: "Runecraft",
  Hunter: "Hunter",
  Construction: "Construction"
};

const SYSTEM_FIELDS = new Set([
  "Date", "date", "Player", "Username", "Combat", "Clan", "Country", "Game mode", "GIM",
  "Cb-3", "F2p", "Banned", "Disqualified", "Clan preference", "Last checked",
  "Last checked unix", "Last changed", "Last changed KC", "Datapoint Cooldown",
  "Primary_ehp", "Primary_ehb", "Overall", "Overall_rank", "Overall_level", "Overall_ehp",
  "Ehp", "Ehp_rank", "Ehb", "Ehb_rank", "Im_ehp", "Lvl3_ehp", "F2p_ehp", "Uim_ehp",
  "1def_ehp", "Gim_ehp", "im_ehp", "uim_ehp", "lvl3_ehp", "f2p_ehp", "im_ehb",
  "uim_ehb", "1def_ehb", "player_name_with_capitalization", "info"
]);

function unwrapData(value: unknown): Record<string, unknown> {
  const record = isRecord(value) ? value : {};
  return isRecord(record.data) ? record.data : record;
}

function normalizeName(username: string, raw: unknown): string {
  return safeString(
    getNestedValue(raw, [
      "data.player_name_with_capitalization",
      "data.info.player_name_with_capitalization",
      "player_name_with_capitalization",
      "info.player_name_with_capitalization",
      "data.Username",
      "data.info.Username",
      "Username"
    ]),
    username
  );
}

export function normalizePlayerInfo(raw: unknown, username: string): PlayerInfo {
  const data = unwrapData(raw);
  const synced = getNestedValue(data, ["collection_log.log_synced", "collection_log_synced", "clog_synced"]);
  return {
    username: normalizeName(username, raw),
    formattedName: normalizeName(username, raw),
    gameMode: safeString(getNestedValue(data, ["Game mode", "game_mode", "gamemode"]), "Normal"),
    lastChecked: safeString(getNestedValue(data, ["Last checked", "last_checked"]), "N/A"),
    lastChanged: safeString(getNestedValue(data, ["Last changed", "last_changed"]), "N/A"),
    collectionLogSynced: typeof synced === "string" || typeof synced === "number" || typeof synced === "boolean" ? synced : undefined,
    raw: data
  };
}

export function extractSkillsFromStats(rawStats: unknown): SkillStat[] {
  const data = unwrapData(rawStats);
  return SKILLS.map((name) => {
    const apiKey = SKILL_API_KEYS[name];
    return {
      name,
      xp: safeNumber(data[apiKey]),
      level: safeNumber(data[`${apiKey}_level`]),
      rank: safeNumber(data[`${apiKey}_rank`])
    };
  });
}

export function extractBossesFromStats(rawStats: unknown): BossStat[] {
  const data = unwrapData(rawStats);
  const excluded = new Set<string>([...Object.values(SKILL_API_KEYS), ...SYSTEM_FIELDS]);
  for (const key of Object.values(SKILL_API_KEYS)) {
    excluded.add(`${key}_rank`);
    excluded.add(`${key}_level`);
    excluded.add(`${key}_ehp`);
  }

  return Object.entries(data)
    .filter(([key, value]) => {
      if (excluded.has(key)) return false;
      if (key.endsWith("_rank") || key.endsWith("_level") || key.toLowerCase().endsWith("_ehp")) return false;
      const number = safeNumber(value);
      return number !== null && number > 0;
    })
    .map(([key, value]) => ({ name: key.replace(/_/g, " "), kc: safeNumber(value) ?? 0 }))
    .sort((a, b) => b.kc - a.kc);
}

export function calculateTotalXp(skills: SkillStat[], rawStats?: unknown): number {
  const overall = safeNumber(getNestedValue(rawStats, ["data.Overall", "Overall"]));
  return overall ?? skills.reduce((sum, skill) => sum + (skill.xp ?? 0), 0);
}

export function calculateTotalLevel(skills: SkillStat[], rawStats?: unknown): number {
  const overall = safeNumber(getNestedValue(rawStats, ["data.Overall_level", "Overall_level"]));
  return overall ?? skills.reduce((sum, skill) => sum + (skill.level ?? 0), 0);
}

export function calculateBossTotal(bosses: BossStat[]): number {
  return bosses.reduce((sum, boss) => sum + boss.kc, 0);
}

export function normalizePlayerStats(raw: unknown, username: string): NormalizedStats {
  const data = unwrapData(raw);
  const skills = extractSkillsFromStats(raw);
  const bosses = extractBossesFromStats(raw);
  return {
    username: normalizeName(username, raw),
    skills,
    bosses,
    totalXp: calculateTotalXp(skills, raw),
    totalLevel: calculateTotalLevel(skills, raw),
    totalBossKc: calculateBossTotal(bosses),
    ehp: safeNumber(data.Ehp),
    ehb: safeNumber(data.Ehb)
  };
}

export function normalizePlayerGains(raw: unknown, username: string): NormalizedStats {
  return normalizePlayerStats(raw, username);
}

export function calculateCollectionPercentage(finished: number | null, available: number | null): number | null {
  return finished !== null && available !== null && available > 0 ? Math.round((finished / available) * 1000) / 10 : null;
}

function collectNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (!isRecord(item)) return "";
      return safeString(item.name ?? item.item_name ?? item.item ?? item.itemName, "");
    })
    .filter(Boolean);
}

export function normalizeCollectionLog(raw: unknown, username: string): NormalizedCollection {
  const data = unwrapData(raw);
  const finishedItems = safeNumber(getNestedValue(data, ["total_collections_finished", "total_items_finished", "obtained"]));
  const availableItems = safeNumber(getNestedValue(data, ["total_collections_available", "total_items_available", "total"]));
  const finishedCategories = safeNumber(getNestedValue(data, ["total_categories_finished"]));
  const availableCategories = safeNumber(getNestedValue(data, ["total_categories_available"]));
  return {
    username,
    finishedItems,
    availableItems,
    finishedCategories,
    availableCategories,
    rank: safeNumber(getNestedValue(data, ["collections_hiscores_rank", "rank"])),
    percentage: calculateCollectionPercentage(finishedItems, availableItems),
    itemNames: collectNames(data.items ?? data.collection_log ?? data.collections),
    missingItemNames: collectNames(data.missing_items ?? data.missing)
  };
}

export function normalizeRecentItems(raw: unknown, username: string): RecentItem[] {
  const data = unwrapData(raw);
  const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : Array.isArray(data.items) ? data.items : [];
  return list.map((item) => {
    const record = isRecord(item) ? item : {};
    return {
      player: username,
      itemName: safeString(record.item_name ?? record.name ?? record.item ?? record.Item, "Mysterious loot"),
      date: safeString(record.date ?? record.time ?? record.created_at ?? record.Date, ""),
      notable: Boolean(record.notable ?? record.onlynotable ?? record.is_notable)
    };
  });
}

export function mergeRecentItems(items: RecentItem[][]): RecentItem[] {
  return items
    .flat()
    .filter((item) => item.itemName !== "Mysterious loot" || item.date)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export function normalizePets(raw: unknown, username: string): PetSummary {
  const data = unwrapData(raw);
  const petsValue = data.pets ?? data.pet_list ?? data.items ?? data.data;
  const pets = Array.isArray(petsValue)
    ? petsValue
        .map((pet) => {
          if (typeof pet === "string") return pet;
          if (!isRecord(pet)) return "";
          return safeString(pet.name ?? pet.pet_name ?? pet.item_name ?? pet.pet, "");
        })
        .filter(Boolean)
    : [];
  return {
    username,
    petCount: safeNumber(data.pet_count ?? data.count ?? data.total ?? pets.length),
    petHours: safeNumber(data.pet_hours ?? data.hours),
    pets
  };
}

export const normalizePetCount = normalizePets;
