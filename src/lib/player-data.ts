import { evaluateAchievements, type AchievementPlayerData, type AchievementResult } from "./achievements";
import { buildCommandCenter, type CommandCenter } from "./game";
import { loadCollections, loadGains, loadInfo, loadPets, loadRecentItems, loadStats } from "./loaders";
import { PLAYER_NAMES } from "./players";
import type { ApiResult, NormalizedCollection, NormalizedStats, PetSummary, PlayerInfo } from "./types";

export type PlayerData = AchievementPlayerData;

export type CorePlayerData = {
  statsResults: ApiResult<NormalizedStats>[];
  gainsResults: ApiResult<NormalizedStats>[];
  collectionResults: ApiResult<NormalizedCollection>[];
  petResults: ApiResult<PetSummary>[];
  recent: Awaited<ReturnType<typeof loadRecentItems>>;
  stats: NormalizedStats[];
  gains: NormalizedStats[];
  collections: NormalizedCollection[];
  pets: PetSummary[];
  players: PlayerData[];
  achievements: AchievementResult[];
  command: CommandCenter;
};

export type CorePlayerDataWithInfo = CorePlayerData & {
  infoResults: ApiResult<PlayerInfo>[];
};

function okData<T>(results: ApiResult<T>[]): T[] {
  return results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
}

function resultData<T>(results: ApiResult<T>[], username: string): T | undefined {
  return results.find((result) => result.player === username && result.ok)?.data;
}

function buildPlayers(input: {
  statsResults: ApiResult<NormalizedStats>[];
  gainsResults: ApiResult<NormalizedStats>[];
  collectionResults: ApiResult<NormalizedCollection>[];
  petResults: ApiResult<PetSummary>[];
}): PlayerData[] {
  return PLAYER_NAMES.map((username) => ({
    username,
    stats: resultData(input.statsResults, username),
    gains: resultData(input.gainsResults, username),
    collection: resultData(input.collectionResults, username),
    pets: resultData(input.petResults, username)
  }));
}

export async function loadCorePlayerData(): Promise<CorePlayerData> {
  const [statsResults, gainsResults, collectionResults, petResults, recent] = await Promise.all([
    loadStats(),
    loadGains("week"),
    loadCollections(),
    loadPets(),
    loadRecentItems()
  ]);
  const stats = okData(statsResults);
  const gains = okData(gainsResults);
  const collections = okData(collectionResults);
  const pets = okData(petResults);
  const players = buildPlayers({ statsResults, gainsResults, collectionResults, petResults });
  const achievements = evaluateAchievements(players);
  const command = buildCommandCenter({ players: PLAYER_NAMES, stats, gains, collections, pets, recentItems: recent.merged });

  return {
    statsResults,
    gainsResults,
    collectionResults,
    petResults,
    recent,
    stats,
    gains,
    collections,
    pets,
    players,
    achievements,
    command
  };
}

export async function loadCorePlayerDataWithInfo(): Promise<CorePlayerDataWithInfo> {
  const [infoResults, core] = await Promise.all([loadInfo(), loadCorePlayerData()]);
  return { ...core, infoResults };
}
