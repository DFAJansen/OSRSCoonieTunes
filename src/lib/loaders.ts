import { PLAYER_NAMES } from "./players";
import type { ActivePartySlot } from "./settings";
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

type PlayerSource = string | ActivePartySlot;

type PlayerTarget = {
  slotName: string;
  activeUsername: string;
  trackingUsername?: string;
};

function targetsFromPlayers(players: readonly PlayerSource[] = [...PLAYER_NAMES]): PlayerTarget[] {
  return players.map((player) => {
    if (typeof player === "string") return { slotName: player, activeUsername: player };
    return {
      slotName: player.slotName,
      activeUsername: player.activeUsername,
      trackingUsername: player.isOverridden ? player.activeUsername : undefined
    };
  });
}

function failTarget<T>(target: PlayerTarget, result: ApiResult<unknown>): ApiResult<T> {
  return { player: target.slotName, ok: false, status: "error", error: result.error ?? "Deze speler kon niet geladen worden." };
}

export async function loadStats(players?: readonly PlayerSource[]): Promise<ApiResult<NormalizedStats>[]> {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, getPlayerStats)));
  return results.map<ApiResult<NormalizedStats>>((result, index) =>
    result.ok && result.data
      ? { player: targets[index].slotName, ok: true, status: "success", data: { ...normalizePlayerStats(result.data, targets[index].slotName), trackingUsername: targets[index].trackingUsername } }
      : failTarget(targets[index], result)
  );
}

export async function loadInfo(players?: readonly PlayerSource[]): Promise<ApiResult<PlayerInfo>[]> {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, getPlayerInfo)));
  return results.map<ApiResult<PlayerInfo>>((result, index) =>
    result.ok && result.data
      ? { player: targets[index].slotName, ok: true, status: "success", data: { ...normalizePlayerInfo(result.data, targets[index].slotName), trackingUsername: targets[index].trackingUsername } }
      : failTarget(targets[index], result)
  );
}

export async function loadGains(period: Period = "week", players?: readonly PlayerSource[]): Promise<ApiResult<NormalizedStats>[]> {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, (name) => getPlayerGains(name, period))));
  return results.map<ApiResult<NormalizedStats>>((result, index) =>
    result.ok && result.data
      ? { player: targets[index].slotName, ok: true, status: "success", data: { ...normalizePlayerGains(result.data, targets[index].slotName), trackingUsername: targets[index].trackingUsername } }
      : failTarget(targets[index], result)
  );
}

export async function loadCollections(players?: readonly PlayerSource[]): Promise<ApiResult<NormalizedCollection>[]> {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, getPlayerCollectionLog)));
  return results.map<ApiResult<NormalizedCollection>>((result, index) =>
    result.ok && result.data
      ? { player: targets[index].slotName, ok: true, status: "success", data: { ...normalizeCollectionLog(result.data, targets[index].slotName), trackingUsername: targets[index].trackingUsername } }
      : failTarget(targets[index], result)
  );
}

export async function loadRecentItems(players?: readonly PlayerSource[]) {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, getPlayerRecentItems)));
  const merged = mergeRecentItems(results.map((result, index) => (result.ok && result.data ? normalizeRecentItems(result.data, targets[index].slotName) : [])));
  return { results: results.map((result, index) => ({ ...result, player: targets[index].slotName })), merged };
}

export async function loadPets(players?: readonly PlayerSource[]): Promise<ApiResult<PetSummary>[]> {
  const targets = targetsFromPlayers(players);
  const results = await Promise.all(targets.map((target) => safePlayerCall(target.activeUsername, getPetCount)));
  return results.map<ApiResult<PetSummary>>((result, index) =>
    result.ok && result.data
      ? { player: targets[index].slotName, ok: true, status: "success", data: { ...normalizePetCount(result.data, targets[index].slotName), trackingUsername: targets[index].trackingUsername } }
      : failTarget(targets[index], result)
  );
}
