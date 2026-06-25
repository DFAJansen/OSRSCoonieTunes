import { evaluateAchievements, type AchievementPlayerData, type AchievementResult } from "./achievements";
import { buildCommandCenter, type CommandCenter } from "./game";
import { loadCollections, loadGains, loadInfo, loadPets, loadRecentItems, loadStats } from "./loaders";
import { getServerActiveParty } from "./server-settings";
import type { ActivePartySlot } from "./settings";
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
  partySlots: ActivePartySlot[];
  statsResults: ApiResult<NormalizedStats>[];
  gainsResults: ApiResult<NormalizedStats>[];
  collectionResults: ApiResult<NormalizedCollection>[];
  petResults: ApiResult<PetSummary>[];
}): PlayerData[] {
  return input.partySlots.map((slot) => ({
    username: slot.slotName,
    stats: resultData(input.statsResults, slot.slotName),
    gains: resultData(input.gainsResults, slot.slotName),
    collection: resultData(input.collectionResults, slot.slotName),
    pets: resultData(input.petResults, slot.slotName)
  }));
}

export async function loadCorePlayerData(): Promise<CorePlayerData> {
  const partySlots = await getServerActiveParty();
  const [statsResults, gainsResults, collectionResults, petResults, recent] = await Promise.all([
    loadStats(partySlots),
    loadGains("week", partySlots),
    loadCollections(partySlots),
    loadPets(partySlots),
    loadRecentItems(partySlots)
  ]);
  const stats = okData(statsResults);
  const gains = okData(gainsResults);
  const collections = okData(collectionResults);
  const pets = okData(petResults);
  const players = buildPlayers({ partySlots, statsResults, gainsResults, collectionResults, petResults });
  const achievements = evaluateAchievements(players);
  const command = buildCommandCenter({ players: partySlots.map((slot) => slot.slotName), stats, gains, collections, pets, recentItems: recent.merged });

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
  const partySlots = await getServerActiveParty();
  const [infoResults, core] = await Promise.all([loadInfo(partySlots), loadCorePlayerData()]);
  return { ...core, infoResults };
}
