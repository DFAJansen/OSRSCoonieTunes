import { normalizeBossName } from "./bosses";
import type { NormalizedStats } from "./types";

export type CollectionBossKcPlayer = {
  player: string;
  kc: number | null;
  isLeader: boolean;
};

export type CollectionBossKcSummary = {
  bossName: string;
  players: CollectionBossKcPlayer[];
};

const CATEGORY_BOSS_MAP: Record<string, string> = {
  "bosses-barrows-chests": "Barrows Chests",
  "bosses-general-graardor": "General Graardor",
  "bosses-commander-zilyana": "Commander Zilyana",
  "bosses-kreearra": "Kree'arra",
  "bosses-kril-tsutsaroth": "K'ril Tsutsaroth",
  "bosses-zulrah": "Zulrah",
  "bosses-vorkath": "Vorkath",
  "bosses-nex": "Nex",
  "bosses-corrupted-gauntlet": "Corrupted Gauntlet",
  "bosses-the-gauntlet": "The Gauntlet",
  "raids-tombs-of-amascut": "Tombs of Amascut",
  "raids-chambers-of-xeric": "Chambers of Xeric",
  "raids-theatre-of-blood": "Theatre of Blood",
  "bosses-abyssal-sire": "Abyssal Sire",
  "bosses-alchemical-hydra": "Alchemical Hydra",
  "bosses-cerberus": "Cerberus",
  "bosses-king-black-dragon": "King Black Dragon",
  "bosses-kraken": "Kraken",
  "bosses-phantom-muspah": "Phantom Muspah",
  "bosses-duke-sucellus": "Duke Sucellus",
  "bosses-the-leviathan": "The Leviathan",
  "bosses-vardorvis": "Vardorvis",
  "bosses-scurrius": "Scurrius",
  "bosses-the-hueycoatl": "The Hueycoatl"
};

export function getBossNameForCollectionCategory(categoryId: string): string | null {
  return CATEGORY_BOSS_MAP[categoryId] ?? null;
}

export function getBossKcForCategory(categoryId: string, playerBossData: NormalizedStats): number | null {
  const bossName = getBossNameForCollectionCategory(categoryId);
  if (!bossName) return null;
  return playerBossData.bosses.find((boss) => normalizeBossName(boss.name) === bossName)?.kc ?? null;
}

export function buildCollectionBossKcSummary(categoryId: string, playersBossData: NormalizedStats[]): CollectionBossKcSummary | null {
  const bossName = getBossNameForCollectionCategory(categoryId);
  if (!bossName) return null;
  const values = playersBossData.map((player) => ({ player: player.username, kc: getBossKcForCategory(categoryId, player) }));
  const highest = Math.max(...values.map((value) => value.kc ?? -1));

  return {
    bossName,
    players: values.map((value) => ({ ...value, isLeader: value.kc !== null && value.kc === highest && highest >= 0 }))
  };
}
