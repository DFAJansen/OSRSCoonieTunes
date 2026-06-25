import type { Period, TempleOsrsResponse } from "./types";
import { errorToMessage, isRecord } from "./format";

const BASE_URL = "https://templeosrs.com/api";

type CacheEntry = {
  expires: number;
  value: unknown;
};

const cache = new Map<string, CacheEntry>();

const TTL = {
  stats: 2 * 60 * 1000,
  gains: 2 * 60 * 1000,
  collection: 5 * 60 * 1000,
  recent: 2 * 60 * 1000,
  maps: 60 * 60 * 1000,
  info: 2 * 60 * 1000,
  pets: 2 * 60 * 1000
};

async function cachedFetch<T>(key: string, url: string, ttl: number): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) return hit.value as T;

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`TempleOSRS gaf ${response.status} terug`);
  }

  const text = await response.text();
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("TempleOSRS gaf geen geldige JSON terug");
  }

  const record = isRecord(value) ? value : {};
  if (record.error) {
    const message = errorToMessage(record.error);
    console.error(`[TempleOSRS] ${url} failed: ${message}`);
    throw new Error(message);
  }

  cache.set(key, { expires: now + ttl, value });
  return value as T;
}

function playerParam(username: string): string {
  return encodeURIComponent(username);
}

export function getPlayerInfo(username: string): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `info:${username}`,
    `${BASE_URL}/player_info.php?player=${playerParam(username)}&formattedrsn=1&cloginfo=1`,
    TTL.info
  );
}

export function getPlayerStats(username: string): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `stats:${username}`,
    `${BASE_URL}/player_stats.php?player=${playerParam(username)}&bosses=1`,
    TTL.stats
  );
}

export function getPlayerGains(username: string, period: Period = "week"): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `gains:${username}:${period}`,
    `${BASE_URL}/player_gains.php?player=${playerParam(username)}&time=${encodeURIComponent(period)}&bosses=1`,
    TTL.gains
  );
}

export function getPlayerDatapoints(username: string, seconds = 2592000): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `datapoints:${username}:${seconds}`,
    `${BASE_URL}/player_datapoints.php?player=${playerParam(username)}&time=${seconds}&bosses=1`,
    TTL.gains
  );
}

export function getPlayerCollectionLog(username: string): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `collection:${username}`,
    `${BASE_URL}/collection-log/player_collection_log.php?player=${playerParam(username)}&categories=all&includenames=1&includemissingitems=1&categoryhours=1&yearlygains=1`,
    TTL.collection
  );
}

export function getPlayerRecentItems(username: string): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(
    `recent:${username}`,
    `${BASE_URL}/collection-log/player_recent_items.php?player=${playerParam(username)}&count=25&onlynotable=0`,
    TTL.recent
  );
}

export function getCollectionItems(): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>("items", `${BASE_URL}/collection-log/items.php`, TTL.maps);
}

export function getCollectionCategories(): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>("categories", `${BASE_URL}/collection-log/categories.php`, TTL.maps);
}

export function getCategoryParameters(): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>("category-parameters", `${BASE_URL}/collection-log/category_parameters.php`, TTL.maps);
}

export function getPetCount(username: string): Promise<TempleOsrsResponse> {
  return cachedFetch<TempleOsrsResponse>(`pets:${username}`, `${BASE_URL}/pets/pet_count.php?player=${playerParam(username)}`, TTL.pets);
}
