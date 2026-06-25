export type Period = "day" | "week" | "month" | "year" | "cday" | "cweek" | "cmonth" | "cyear";

export type ApiResult<T> = {
  player?: string;
  ok: boolean;
  data?: T;
  error?: string;
  status?: "loading" | "success" | "partial" | "error";
};

export type TempleOsrsResponse = Record<string, unknown> | unknown[];

export type SkillName =
  | "Attack"
  | "Defence"
  | "Strength"
  | "Hitpoints"
  | "Ranged"
  | "Prayer"
  | "Magic"
  | "Cooking"
  | "Woodcutting"
  | "Fletching"
  | "Fishing"
  | "Firemaking"
  | "Crafting"
  | "Smithing"
  | "Mining"
  | "Herblore"
  | "Agility"
  | "Thieving"
  | "Slayer"
  | "Farming"
  | "Runecrafting"
  | "Hunter"
  | "Construction";

export type SkillStat = {
  name: SkillName;
  xp: number | null;
  level: number | null;
  rank: number | null;
};

export type BossStat = {
  name: string;
  kc: number;
};

export type NormalizedStats = {
  username: string;
  skills: SkillStat[];
  bosses: BossStat[];
  totalXp: number;
  totalLevel: number;
  totalBossKc: number;
  ehp: number | null;
  ehb: number | null;
};

export type PlayerInfo = {
  username: string;
  formattedName?: string;
  gameMode?: string;
  lastChecked?: string;
  lastChanged?: string;
  collectionLogSynced?: string | boolean | number;
  raw: Record<string, unknown>;
};

export type NormalizedCollection = {
  username: string;
  finishedItems: number | null;
  availableItems: number | null;
  finishedCategories: number | null;
  availableCategories: number | null;
  rank: number | null;
  percentage: number | null;
  itemNames: string[];
  missingItemNames: string[];
  collectionItems: CollectionLogItemRecord[];
};

export type CollectionLogItemRecord = {
  name: string;
  itemId?: number;
  count: number | null;
  date?: string;
  categoryKey?: string;
};

export type RecentItem = {
  player: string;
  itemName: string;
  date: string;
  notable: boolean;
};

export type PetSummary = {
  username: string;
  petCount: number | null;
  petHours: number | null;
  pets: string[];
};

export type Award = {
  title: string;
  player: string;
  detail: string;
};
