import { PLAYER_NAMES } from "./players";
import {
  getPetCount,
  getPlayerCollectionLog,
  getPlayerGains,
  getPlayerInfo,
  getPlayerRecentItems,
  getPlayerStats
} from "./templeosrs";
import { safePlayerCall } from "./api";
import {
  mergeRecentItems,
  normalizeCollectionLog,
  normalizePetCount,
  normalizePlayerInfo,
  normalizePlayerGains,
  normalizePlayerStats,
  normalizeRecentItems
} from "./normalizers-fixed";
import type { Period } from "./types";
import type { ApiResult, NormalizedCollection, NormalizedStats, PetSummary, PlayerInfo } from "./types";

function failed<T>(result: ApiResult<unknown>): ApiResult<T> {
  return { player: result.player, ok: false, status: "error", error: result.error ?? "Deze speler kon niet geladen worden." };
}

export async function loadStats(players = [...PLAYER_NAMES]): Promise<ApiResult<NormalizedStats>[]> {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, getPlayerStats)));
  return results.map<ApiResult<NormalizedStats>>((result) =>
    result.ok && result.data ? { player: result.player, ok: true, status: "success", data: normalizePlayerStats(result.data, result.player ?? "") } : failed(result)
  );
}

export async function loadInfo(players = [...PLAYER_NAMES]): Promise<ApiResult<PlayerInfo>[]> {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, getPlayerInfo)));
  return results.map<ApiResult<PlayerInfo>>((result) =>
    result.ok && result.data ? { player: result.player, ok: true, status: "success", data: normalizePlayerInfo(result.data, result.player ?? "") } : failed(result)
  );
}

export async function loadGains(period: Period = "week", players = [...PLAYER_NAMES]): Promise<ApiResult<NormalizedStats>[]> {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, (name) => getPlayerGains(name, period))));
  return results.map<ApiResult<NormalizedStats>>((result) =>
    result.ok && result.data ? { player: result.player, ok: true, status: "success", data: normalizePlayerGains(result.data, result.player ?? "") } : failed(result)
  );
}

export async function loadCollections(players = [...PLAYER_NAMES]): Promise<ApiResult<NormalizedCollection>[]> {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, getPlayerCollectionLog)));
  return results.map<ApiResult<NormalizedCollection>>((result) =>
    result.ok && result.data ? { player: result.player, ok: true, status: "success", data: normalizeCollectionLog(result.data, result.player ?? "") } : failed(result)
  );
}

export async function loadRecentItems(players = [...PLAYER_NAMES]) {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, getPlayerRecentItems)));
  const merged = mergeRecentItems(results.map((result) => (result.ok && result.data ? normalizeRecentItems(result.data, result.player ?? "") : [])));
  return { results, merged };
}

export async function loadPets(players = [...PLAYER_NAMES]): Promise<ApiResult<PetSummary>[]> {
  const results = await Promise.all(players.map((player) => safePlayerCall(player, getPetCount)));
  return results.map<ApiResult<PetSummary>>((result) =>
    result.ok && result.data ? { player: result.player, ok: true, status: "success", data: normalizePetCount(result.data, result.player ?? "") } : failed(result)
  );
}
